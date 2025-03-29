import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const useUsageHistory = () => {
  const [lastUses, setLastUses] = useState([]);
  const [usageHistoryLoading, setUsageHistoryLoading] = useState(true);
  const currentUser = auth().currentUser;

  useEffect(() => {
    let unsubscribe = () => {};

    if (currentUser) {
      setUsageHistoryLoading(true);
      
      unsubscribe = firestore()
        .collection('students')
        .where('Email', '==', currentUser.email)
        .limit(1)
        .onSnapshot(
          snapshot => {
            if (!snapshot.empty) {
              const userData = snapshot.docs[0].data();
              // Filter out empty entries
              const filteredUses = (userData.lastUses || []).filter(use => use && use !== "");
              setLastUses(filteredUses);
            } else {
              console.log('No user document found with email:', currentUser.email);
              setLastUses([]);
            }
            setUsageHistoryLoading(false);
          },
          error => {
            console.error('Error fetching last uses:', error);
            Alert.alert('Error', 'Failed to load usage history.');
            setUsageHistoryLoading(false);
          }
        );
    } else {
      setLastUses([]);
      setUsageHistoryLoading(false);
    }

    return () => unsubscribe();
  }, [currentUser]);

  return {
    lastUses,
    usageHistoryLoading,
    showHistorySection: lastUses.length > 0
  };
};

export default useUsageHistory;