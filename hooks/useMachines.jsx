import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

/**
 * Custom hook to manage machine data
 * @returns {Object} Machine data and related functions
 */
const useMachines = () => {
  const [availableMachines, setAvailableMachines] = useState([]);
  const [bookedMachines, setBookedMachines] = useState([]);
  const [maintenanceMachines, setMaintenanceMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userHasBooking, setUserHasBooking] = useState(false);
  const currentUser = auth().currentUser;

  // Function to refresh machines data
  const refreshMachines = () => {
    setLoading(true);
    // The listener will automatically update the data
  };

  useEffect(() => {
    // Set up real-time listener for machine collection
    const unsubscribe = firestore()
      .collection('machines')
      .onSnapshot(
        snapshot => {
          const available = [];
          const booked = [];
          const maintenance = [];
          let hasBooking = false;

          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.underMaintenance === true) {
              maintenance.push({id: doc.id, ...data});
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
          booked.sort((a, b) => (a.number || 0) - (b.number || 0));
          maintenance.sort((a, b) => (a.number || 0) - (b.number || 0));

          setAvailableMachines(available);
          setBookedMachines(booked);
          setMaintenanceMachines(maintenance);
          setUserHasBooking(hasBooking);
          setLoading(false);
        },
        error => {
          console.error('Error listening to machines collection:', error);
          setLoading(false);
        },
      );

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [currentUser]);

  return {
    availableMachines,
    bookedMachines,
    maintenanceMachines,
    loading,
    userHasBooking,
    refreshMachines,
  };
};

export default useMachines;