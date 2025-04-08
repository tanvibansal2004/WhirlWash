import firestore from '@react-native-firebase/firestore';
import userService from './userService';
import { createExpiryTime, createOTPVerifyExpiryTime } from '../utils/timeUtils';

// Simple flag to track which machines have already been auto-unbooked
const alreadyAutoUnbooked = {};

/**
 * Service to handle machine-related operations
 */
const machineService = {
  // bookMachine: async (machineId, userEmail) => {
  //   try {
  //     // Get user details
  //     const userDetails = await userService.getUserDetails(userEmail);
  //     if (!userDetails) {
  //       throw new Error('User profile not found');
  //     }
  
  //     // Generate a 6-digit OTP
  //     const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  //     // Calculate OTP verification expiry time (60 seconds from now)
  //     const otpVerifyExpiryTime = createOTPVerifyExpiryTime();
      
  //     const machineRef = firestore().collection('machines').doc(machineId);
  //     const machineDoc = await machineRef.get();
  //     const machineData = machineDoc.data();
  
  //     await machineRef.update({
  //       pendingOTPVerification: true,
  //       inUse: false,
  //       bookedBy: userEmail,
  //       bookingTime: firestore.FieldValue.serverTimestamp(),
  //       status: 'pending-otp',
  //       otpVerifyExpiryTime: otpVerifyExpiryTime,
  //       userName: userDetails.Name || '',
  //       userMobile: userDetails.MobileNo || '',
  //       autoUnbooked: false,
  //       otp: otp
  //     });
  
  //     // We won't set a timer here as we now have a useEffect in the component to check
  
  //     return {
  //       success: true,
  //       machineNumber: machineData.number,
  //       otp: otp
  //     };
  //   } catch (error) {
  //     console.error('Error booking machine:', error);
  //     throw error;
  //   }
  // },

  bookMachine: async (machineId, userEmail) => {
    try {
      // Get user details
      const userDetails = await userService.getUserDetails(userEmail);
      if (!userDetails) {
        throw new Error('User profile not found');
      }
  
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
      // Calculate OTP verification expiry time (60 seconds from now)
      const otpVerifyExpiryTime = createOTPVerifyExpiryTime();
      
      // Use a transaction to prevent race conditions
      const result = await firestore().runTransaction(async (transaction) => {
        // Get the machine document in the transaction
        const machineRef = firestore().collection('machines').doc(machineId);
        const machineDoc = await transaction.get(machineRef);
        
        if (!machineDoc.exists) {
          throw new Error('Machine not found');
        }
        
        const machineData = machineDoc.data();
        
        // Check if machine is already in use or pending OTP verification
        if (machineData.inUse === true || machineData.pendingOTPVerification === true) {
          throw new Error('Machine is already booked or pending verification');
        }
        
        // Update machine status atomically
        transaction.update(machineRef, {
          pendingOTPVerification: true,
          inUse: false,
          bookedBy: userEmail,
          bookingTime: firestore.FieldValue.serverTimestamp(),
          status: 'pending-otp',
          otpVerifyExpiryTime: otpVerifyExpiryTime,
          userName: userDetails.Name || '',
          userMobile: userDetails.MobileNo || '',
          autoUnbooked: false,
          otp: otp
        });
        
        // Return machine data for success message
        return {
          success: true,
          machineNumber: machineData.number,
          otp: otp
        };
      });
      
      return result;
    } catch (error) {
      // console.error('Error booking machine:', error);
      
      // Check if this is a "already booked" error and provide a clearer message
      if (error.message && error.message.includes('already booked')) {
        throw new Error('This machine was just booked by someone else. Please try another machine.');
      }
      
      throw error;
    }
  },

  verifyOTPAndStartMachine: async (machineId, userEmail, otp) => {
    try {
      const machineDoc = await firestore()
        .collection('machines')
        .doc(machineId)
        .get();
      
      if (!machineDoc.exists) {
        throw new Error('Machine not found');
      }
      
      const machineData = machineDoc.data();
      
      // Check if OTP matches and machine is in pending OTP state
      if (
        machineData.pendingOTPVerification !== true || 
        machineData.bookedBy !== userEmail ||
        machineData.otp !== otp
      ) {
        return false;
      }
      
      // Get user details
      const userDetails = await userService.getUserDetails(userEmail);
      
      // Prepare updated lastUses array (last 3 users)
      const updatedLastUses = machineData.lastUses || [];
      const newUserEntry = {
        email: userEmail,
        name: machineData.userName || '',
        mobile: machineData.userMobile || '',
        timestamp: new Date().toISOString(),
      };

      // Only add new user if not already the most recent user
      if (
        !updatedLastUses.length ||
        updatedLastUses[0].email !== userEmail
      ) {
        // Shift existing entries down
        if (updatedLastUses.length >= 3) {
          updatedLastUses.pop(); // Remove the oldest entry
        }
        updatedLastUses.unshift(newUserEntry);
      }
      
      // Calculate expiry time (from your timeUtils)
      const expiryTime = createExpiryTime();
      
      // Update machine status
      await firestore().collection('machines').doc(machineId).update({
        pendingOTPVerification: false,
        inUse: true,
        status: 'in-use',
        otpVerifyExpiryTime: null,
        expiryTime: expiryTime,
        otp: null,
        lastUses: updatedLastUses // Add this line to update the lastUses array
      });
      
      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  },

  autoReleaseIfOTPNotVerified: async (machineId, userEmail) => {
    try {
      // Check if the machine is still in pendingOTPVerification state
      const machineDoc = await firestore().collection('machines').doc(machineId).get();
      
      if (!machineDoc.exists) {
        return null; // Return null to signal no operation was performed
      }
      
      const machineData = machineDoc.data();
      
      if (!machineData || machineData.pendingOTPVerification !== true || machineData.bookedBy !== userEmail) {
        return null; // Return null to signal no operation was performed
      }

      // Reset machine to available
      await firestore().collection('machines').doc(machineId).update({
        pendingOTPVerification: false,
        bookedBy: null,
        status: 'available',
        otpVerifyExpiryTime: null,
        userName: '',
        userMobile: '',
        otp: null,
      });

      console.log(`Machine ${machineId} auto-released due to OTP verification timeout`);
      return true; // Return true to signal success
    } catch (error) {
      console.error('Error auto-releasing machine:', error);
      return false; // Return false to signal error
    }
  },

  unbookMachine: async (machineId, userEmail) => {
    try {
      // Apply cooldown to user
      await userService.applyCooldown(userEmail);

      // Update machine status
      const machineRef = firestore().collection('machines').doc(machineId);
      const machineDoc = await machineRef.get();
      
      if (!machineDoc.exists) {
        throw new Error('Machine not found');
      }
      
      const machineData = machineDoc.data();

      // Prepare updated lastUses array
      const updatedLastUses = machineData.lastUses || [];
      const newUserEntry = {
        email: userEmail,
        name: machineData.userName || '',
        mobile: machineData.userMobile || '',
        timestamp: new Date().toISOString(),
      };

      // Only add new user if not already the most recent user
      if (
        !updatedLastUses.length ||
        updatedLastUses[0].email !== userEmail
      ) {
        // Shift existing entries down
        if (updatedLastUses.length >= 3) {
          updatedLastUses.pop(); // Remove the oldest entry
        }
        updatedLastUses.unshift(newUserEntry);
      }

      await machineRef.update({
        inUse: false,
        bookedBy: null,
        status: 'available',
        lastUsedBy: userEmail,
        lastUserName: machineData.userName || '',
        lastUserMobile: machineData.userMobile || '',
        lastUsedTime: new Date().toISOString(),
        autoUnbooked: false,
        lastUses: updatedLastUses,
        expiryTime: null,
      });
      
      return true; // Return true to signal success
    } catch (error) {
      console.error('Error unbooking machine:', error);
      throw error;
    }
  },

  autoUnbookMachine: async (machineId, userEmail) => {
    // CRITICAL FIX: Check if this machine has already been auto-unbooked
    if (alreadyAutoUnbooked[machineId]) {
      console.log(`Machine ${machineId} has already been auto-unbooked, skipping additional alerts`);
      return null; // Return null to signal no operation was performed
    }
    
    try {
      // Mark as already auto-unbooked to prevent multiple alerts
      alreadyAutoUnbooked[machineId] = true;
      
      // Check if the machine is actually in use and booked by this user
      const machineDoc = await firestore()
        .collection('machines')
        .doc(machineId)
        .get();
        
      if (!machineDoc.exists) {
        delete alreadyAutoUnbooked[machineId];
        return null; // Return null to signal no operation was performed
      }
      
      const machineData = machineDoc.data();

      // Only proceed if machine is still booked by the same user
      if (!machineData || machineData.bookedBy !== userEmail || machineData.status !== 'in-use') {
        delete alreadyAutoUnbooked[machineId];
        return null; // Return null to signal no operation was performed
      }

      // Apply penalty to user
      await userService.applyPenalty(userEmail);

      // Prepare updated lastUses array if needed
      const updatedLastUses = machineData.lastUses || [];
      
      // If the user is not the most recent in lastUses, add them
      if (!updatedLastUses.length || updatedLastUses[0].email !== userEmail) {
        const newUserEntry = {
          email: userEmail,
          name: machineData.userName || 'Unknown User',
          mobile: machineData.userMobile || '',
          timestamp: new Date().toISOString(),
        };
        
        if (updatedLastUses.length >= 3) {
          updatedLastUses.pop();
        }
        
        updatedLastUses.unshift(newUserEntry);
      }

      // Update machine status
      await firestore().collection('machines').doc(machineId).update({
        inUse: false,
        bookedBy: null,
        status: 'available',
        lastUsedBy: userEmail,
        lastUserName: machineData.userName || 'Unknown User',
        lastUserMobile: machineData.userMobile || '',
        lastUsedTime: new Date().toISOString(),
        autoUnbooked: true,
        lastUses: updatedLastUses,
        expiryTime: null,
      });

      console.log(`Machine ${machineId} auto-unbooked. Last user: ${machineData.userName || 'Unknown User'}`);
      
      // After 1 minute, clear the auto-unbooked flag to allow future operations on this machine
      setTimeout(() => {
        delete alreadyAutoUnbooked[machineId];
      }, 60000);  // 1 minute
      
      return true; // Return true to signal success
    } catch (error) {
      console.error('Error auto-unbooking machine:', error);
      delete alreadyAutoUnbooked[machineId];
      return false; // Return false to signal error
    }
  },

  getMachineDetails: async (machineId) => {
    try {
      const machineDoc = await firestore()
        .collection('machines')
        .doc(machineId)
        .get();
      
      if (!machineDoc.exists) {
        return null;
      }
      
      return { id: machineDoc.id, ...machineDoc.data() };
    } catch (error) {
      console.error('Error getting machine details:', error);
      throw error;
    }
  },
};

export default machineService;