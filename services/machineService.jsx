import firestore from '@react-native-firebase/firestore';
import userService from './userService';
import { createExpiryTime } from '../utils/timeUtils';

/**
 * Service to handle machine-related operations
 */
const machineService = {
  /**
   * Book a machine for a user
   * @param {string} machineId - ID of the machine to book
   * @param {string} userEmail - Email of the user booking the machine
   * @returns {Promise<void>}
   */
  bookMachine: async (machineId, userEmail) => {
    try {
      // Get user details
      const userDetails = await userService.getUserDetails(userEmail);
      if (!userDetails) {
        throw new Error('User profile not found');
      }

      // Calculate expiry time (45 seconds from now)
      const expiryTime = createExpiryTime();

      const machineRef = firestore().collection('machines').doc(machineId);

      // Fetch current machine data to update lastUses
      const machineDoc = await machineRef.get();
      const machineData = machineDoc.data();

      // Prepare updated lastUses array (last 3 users)
      const updatedLastUses = machineData.lastUses || [];
      const newUserEntry = {
        email: userEmail,
        name: userDetails.Name || '',
        mobile: userDetails.MobileNo || '',
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
        inUse: true,
        bookedBy: userEmail,
        bookingTime: firestore.FieldValue.serverTimestamp(),
        status: 'in-use',
        expiryTime: expiryTime,
        userName: userDetails.Name || '',
        userMobile: userDetails.MobileNo || '',
        autoUnbooked: false,
        lastUses: updatedLastUses,
      });

      // Set a timer to auto-unbook the machine
      setTimeout(() => {
        machineService.autoUnbookMachine(machineId, userEmail);
      }, 45000); // 45 seconds
    } catch (error) {
      console.error('Error booking machine:', error);
      throw error;
    }
  },

  /**
   * Unbook a machine
   * @param {string} machineId - ID of the machine to unbook
   * @param {string} userEmail - Email of the user unbooking the machine
   * @returns {Promise<void>}
   */
  unbookMachine: async (machineId, userEmail) => {
    try {
      // Apply cooldown to user
      await userService.applyCooldown(userEmail);

      // Update machine status
      const machineRef = firestore().collection('machines').doc(machineId);
      const machineDoc = await machineRef.get();
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
      });
    } catch (error) {
      console.error('Error unbooking machine:', error);
      throw error;
    }
  },

  /**
   * Automatically unbook a machine after time expires
   * @param {string} machineId - ID of the machine to auto-unbook
   * @param {string} userEmail - Email of the user who booked the machine
   * @returns {Promise<void>}
   */
  autoUnbookMachine: async (machineId, userEmail) => {
    try {
      const machineDoc = await firestore()
        .collection('machines')
        .doc(machineId)
        .get();
      const machineData = machineDoc.data();

      // Only proceed if machine is still booked by the same user
      if (!machineData || machineData.bookedBy !== userEmail) {
        return;
      }

      // Apply penalty to user
      await userService.applyPenalty(userEmail);

      // Update machine status
      await firestore().collection('machines').doc(machineId).update({
        inUse: false,
        bookedBy: null,
        status: 'available',
        lastUsedBy: userEmail,
        lastUserName: machineData.userName || 'Unknown User',
        lastUserMobile: machineData.userMobile,
        lastUsedTime: new Date().toISOString(),
        autoUnbooked: true,
      });

      console.log(`Machine ${machineId} auto-unbooked. Last user: ${machineData.userName || 'Unknown User'}`);
    } catch (error) {
      console.error('Error auto-unbooking machine:', error);
    }
  },

  /**
   * Get machine details
   * @param {string} machineId - ID of the machine
   * @returns {Promise<Object>} Machine details
   */
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