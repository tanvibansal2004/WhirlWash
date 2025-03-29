import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

const usePendingOTPMachines = () => {
  const [pendingOTPMachines, setPendingOTPMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listener for pending OTP machines
    const unsubscribe = firestore()
      .collection('machines')
      .where('pendingOTPVerification', '==', true)
      .onSnapshot(
        snapshot => {
          const pendingOTP = [];

          snapshot.forEach(doc => {
            const data = doc.data();
            pendingOTP.push({ id: doc.id, ...data });
          });

          // Sort machines by number
          pendingOTP.sort((a, b) => (a.number || 0) - (b.number || 0));
          setPendingOTPMachines(pendingOTP);
          setLoading(false);
        },
        error => {
          console.error('Error listening to pending OTP machines:', error);
          Alert.alert('Error', 'Failed to load pending OTP machines.');
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, []);

  return {
    pendingOTPMachines,
    loading
  };
};

export default usePendingOTPMachines;