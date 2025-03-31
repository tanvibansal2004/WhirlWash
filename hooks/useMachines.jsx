// import { useState, useEffect } from 'react';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// /**
//  * Custom hook to manage machine data
//  * @returns {Object} Machine data and related functions
//  */
// const useMachines = () => {
//   const [availableMachines, setAvailableMachines] = useState([]);
//   const [bookedMachines, setBookedMachines] = useState([]);
//   const [maintenanceMachines, setMaintenanceMachines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userHasBooking, setUserHasBooking] = useState(false);
//   const currentUser = auth().currentUser;

//   // Function to refresh machines data
//   const refreshMachines = () => {
//     setLoading(true);
//     // The listener will automatically update the data
//   };

//   useEffect(() => {
//     // Set up real-time listener for machine collection
//     const unsubscribe = firestore()
//       .collection('machines')
//       .onSnapshot(
//         snapshot => {
//           const available = [];
//           const booked = [];
//           const maintenance = [];
//           let hasBooking = false;

//           snapshot.forEach(doc => {
//             const data = doc.data();
//             if (data.underMaintenance === true) {
//               maintenance.push({id: doc.id, ...data});
//             } else if (data.inUse === true) {
//               if (data.bookedBy === currentUser?.email) {
//                 hasBooking = true;
//               }
//               booked.push({id: doc.id, ...data});
//             } else {
//               available.push({id: doc.id, ...data});
//             }
//           });

//           // Sort machines by number for consistent display
//           available.sort((a, b) => (a.number || 0) - (b.number || 0));
//           booked.sort((a, b) => (a.number || 0) - (b.number || 0));
//           maintenance.sort((a, b) => (a.number || 0) - (b.number || 0));

//           setAvailableMachines(available);
//           setBookedMachines(booked);
//           setMaintenanceMachines(maintenance);
//           setUserHasBooking(hasBooking);
//           setLoading(false);
//         },
//         error => {
//           console.error('Error listening to machines collection:', error);
//           setLoading(false);
//         },
//       );

//     // Clean up the listener when component unmounts
//     return () => unsubscribe();
//   }, [currentUser]);

//   return {
//     availableMachines,
//     bookedMachines,
//     maintenanceMachines,
//     loading,
//     userHasBooking,
//     refreshMachines,
//   };
// };

// export default useMachines;

import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

/**
 * Custom hook to manage machine data
 * @returns {Object} Machine data and related functions
 */
const useMachines = () => {
  const [availableMachines, setAvailableMachines] = useState([]);
  const [bookedMachines, setBookedMachines] = useState([]);
  const [pendingOTPMachines, setPendingOTPMachines] = useState([]);
  const [maintenanceMachines, setMaintenanceMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userHasBooking, setUserHasBooking] = useState(false);
  const [userHasPendingOTP, setUserHasPendingOTP] = useState(false);
  const currentUser = auth().currentUser;

  // Function to refresh machines data
  const refreshMachines = () => {};

  useEffect(() => {
    // Set up real-time listener for machine collection
    const unsubscribe = firestore()
      .collection('machines')
      .onSnapshot(
        snapshot => {
          const available = [];
          const booked = [];
          const pending = [];
          const maintenance = [];
          let hasBooking = false;
          let hasPendingOTP = false;

          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.underMaintenance === true) {
              maintenance.push({id: doc.id, ...data});
            } else if (data.pendingOTPVerification === true) {
              // Check if current user has a pending OTP
              if (data.bookedBy === currentUser?.email) {
                hasPendingOTP = true;
              }
              pending.push({id: doc.id, ...data});
            } else if (data.inUse === true) {
              if (data.bookedBy === currentUser?.email) {
                hasBooking = true;
              }
              booked.push({id: doc.id, ...data});
            } else {
              available.push({id: doc.id, ...data});
            }
          });

          // Sort machines by number for consistent display
          available.sort((a, b) => (a.number || 0) - (b.number || 0));
          pending.sort((a, b) => (a.number || 0) - (b.number || 0));
          booked.sort((a, b) => (a.number || 0) - (b.number || 0));
          maintenance.sort((a, b) => (a.number || 0) - (b.number || 0));

          setAvailableMachines(available);
          setPendingOTPMachines(pending);
          setBookedMachines(booked);
          setMaintenanceMachines(maintenance);
          setUserHasBooking(hasBooking);
          setUserHasPendingOTP(hasPendingOTP);
          setLoading(false);
        },
        error => {
          console.error('Error listening to machines collection:', error);
          Alert.alert('Error', 'Failed to load machine data.');
          setLoading(false);
        },
      );

    // Set up listener for OTP verification confirmation
    let otpVerificationListener = () => {};
    
    if (currentUser) {
      otpVerificationListener = firestore()
        .collection('machines')
        .where('bookedBy', '==', currentUser.email)
        .where('pendingOTPVerification', '==', false)
        .where('inUse', '==', true)
        .onSnapshot(snapshot => {
          const freshlyVerifiedMachines = snapshot.docChanges().filter(
            change => change.type === 'modified' || change.type === 'added'
          );
          
          if (freshlyVerifiedMachines.length > 0) {
            // Find machines that just got their OTP verified
            const otpJustVerified = freshlyVerifiedMachines.some(change => {
              const data = change.doc.data();
              // Check if this machine was just verified by comparing timestamps
              const now = new Date();
              const bookingTime = data.otpVerifiedTime ? new Date(data.otpVerifiedTime) : null;
              
              // If booking time is within the last 5 seconds, consider it just verified
              return bookingTime && (now - bookingTime) / 1000 < 5;
            });
            
            if (otpJustVerified) {
              // Alert user that their time has started
              Alert.alert('Your Laundry Time Has Started', 'You have 60 seconds to use the machine.');
            }
          }
        });
    }

    // Clean up the listeners when component unmounts
    return () => {
      unsubscribe();
      otpVerificationListener();
    };
  }, [currentUser]);

  return {
    availableMachines,
    bookedMachines,
    pendingOTPMachines,
    maintenanceMachines,
    loading,
    userHasBooking,
    userHasPendingOTP,
    refreshMachines,
  };
};

export default useMachines;