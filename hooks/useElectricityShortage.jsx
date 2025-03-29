import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

const useElectricityShortage = (isAdmin) => {
  const [electricityShortage, setElectricityShortage] = useState(false);

  // Fetch initial electricity shortage state
  useEffect(() => {
    if (!isAdmin) return;

    const fetchElectricityShortageStatus = async () => {
      try {
        const statusDoc = await firestore()
          .collection('systemStatus')
          .doc('electricityStatus')
          .get();

        if (statusDoc.exists) {
          const data = statusDoc.data();
          setElectricityShortage(data.isShortage || false);
        }
      } catch (error) {
        console.error('Error fetching electricity shortage status:', error);
      }
    };

    fetchElectricityShortageStatus();
  }, [isAdmin]);

  // Update electricity shortage state in Firestore
  const updateElectricityShortage = async (newState) => {
    if (!isAdmin) return;
    
    setElectricityShortage(newState);
    
    try {
      const electricityStatusRef = firestore()
        .collection('systemStatus')
        .doc('electricityStatus');

      // Get current status to determine how to handle startTime
      const currentStatus = await electricityStatusRef.get();
      const currentData = currentStatus.data() || {};

      const updateData = {
        isShortage: newState
      };

      // If turning on, and no existing startTime, set new timestamp
      if (newState && !currentData.startTime) {
        updateData.startTime = firestore.FieldValue.serverTimestamp();
      } 
      // If turning off, set startTime to null
      else if (!newState) {
        updateData.startTime = null;
      }
      // If already on, preserve existing startTime
      else if (currentData.startTime) {
        updateData.startTime = currentData.startTime;
      }

      await electricityStatusRef.set(updateData, { merge: true });
    } catch (error) {
      console.error('Error updating electricity shortage status:', error);
      Alert.alert('Error', 'Failed to update electricity shortage status.');
    }
  };

  return { 
    electricityShortage, 
    updateElectricityShortage 
  };
};

export default useElectricityShortage;