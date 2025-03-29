import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const useAdminPermission = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (currentUser) {
        try {
          const adminRef = firestore().collection('admins');
          const snapshot = await adminRef
            .where('email', '==', currentUser.email)
            .get();

          if (!snapshot.empty) {
            setIsAdmin(true);
          } else {
            Alert.alert(
              'Access Denied',
              'You do not have permission to access this page.',
            );
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          Alert.alert('Error', 'Failed to verify admin permissions.');
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  return { isAdmin, loading };
};

export default useAdminPermission;