import {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

/**
 * Custom hook to manage user status related to booking restrictions
 * @param {string} userEmail - Current user's email
 * @returns {Object} User status information
 */
const useUserStatus = userEmail => {
  const [userCooldownUntil, setUserCooldownUntil] = useState(null);
  const [penaltyUntil, setPenaltyUntil] = useState(null);
  const [restrictionSeconds, setRestrictionSeconds] = useState(0);
  const [restrictionType, setRestrictionType] = useState(null);
  const [hasPenaltyNotification, setHasPenaltyNotification] = useState(false);

  // Listen for user status changes
  useEffect(() => {
    if (!userEmail) return;

    const userStatusUnsubscribe = firestore()
      .collection('students')
      .where('Email', '==', userEmail)
      .limit(1)
      .onSnapshot(
        snapshot => {
          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            const userRef = snapshot.docs[0].ref;

            // Check for cooldown period
            if (userData.cooldownUntil) {
              const cooldownTime = new Date(userData.cooldownUntil);
              if (cooldownTime > new Date()) {
                setUserCooldownUntil(cooldownTime);
              } else {
                setUserCooldownUntil(null);
              }
            } else {
              setUserCooldownUntil(null);
            }

            // Check for penalty period
            if (userData.penaltyUntil) {
              const penaltyTime = new Date(userData.penaltyUntil);
              if (penaltyTime > new Date()) {
                setPenaltyUntil(penaltyTime);

                // CHANGE: First update the restriction states immediately
                setRestrictionType('penalty');
                setRestrictionSeconds(
                  Math.ceil((penaltyTime - new Date()) / 1000),
                );

                // Check if there's a pending notification
                if (userData.hasPenaltyNotification === true) {
                  Alert.alert(
                    'Penalty Applied',
                    'You did not unbook your machine and it was automatically released. You will not be able to book again for 1 minute.',
                  );

                  // Clear the notification flag
                  userRef.update({hasPenaltyNotification: false});
                }
              } else {
                setPenaltyUntil(null);
              }
            } else {
              setPenaltyUntil(null);
            }
          }
        },
        error => {
          console.error('Error listening to user status:', error);
        },
      );

    return () => userStatusUnsubscribe();
  }, [userEmail]);

  // Update the restriction timer
  useEffect(() => {
    const now = new Date();

    if (penaltyUntil && penaltyUntil > now) {
      setRestrictionType('penalty');
      setRestrictionSeconds(Math.ceil((penaltyUntil - now) / 1000));
    } else if (userCooldownUntil && userCooldownUntil > now) {
      setRestrictionType('cooldown');
      setRestrictionSeconds(Math.ceil((userCooldownUntil - now) / 1000));
    } else {
      setRestrictionType(null);
      setRestrictionSeconds(0);
    }

    const timer = setInterval(() => {
      const currentTime = new Date();

      if (penaltyUntil && penaltyUntil > currentTime) {
        setRestrictionType('penalty');
        setRestrictionSeconds(Math.ceil((penaltyUntil - currentTime) / 1000));
      } else if (userCooldownUntil && userCooldownUntil > currentTime) {
        setRestrictionType('cooldown');
        setRestrictionSeconds(
          Math.ceil((userCooldownUntil - currentTime) / 1000),
        );
      } else {
        setRestrictionType(null);
        setRestrictionSeconds(0);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [penaltyUntil, userCooldownUntil]);

  return {
    userCooldownUntil,
    penaltyUntil,
    restrictionSeconds,
    restrictionType,
    hasPenaltyNotification,
  };
};

export default useUserStatus;
