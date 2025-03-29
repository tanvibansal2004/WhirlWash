import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const useBookings = () => {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProgress, setShowProgress] = useState(false);
  const currentUser = auth().currentUser;

  useEffect(() => {
    let unsubscribe = () => {};

    if (currentUser) {
      setLoading(true);

      // Set up real-time listener for bookings
      unsubscribe = firestore()
        .collection('machines')
        .where('inUse', '==', true)
        .where('bookedBy', '==', currentUser.email)
        .onSnapshot(
          snapshot => {
            const bookings = [];
            snapshot.forEach(doc => {
              const data = doc.data();
              // Calculate time remaining for each booking
              const expiryTime = data.expiryTime ? new Date(data.expiryTime) : null;
              const now = new Date();
              const timeRemaining = expiryTime ? Math.max(0, Math.floor((expiryTime - now) / 1000)) : 0;
              
              bookings.push({ 
                id: doc.id, 
                ...data, 
                timeRemaining 
              });
            });
            setUserBookings(bookings);
            setLoading(false);

            // Show progress screen if there are active bookings
            if (bookings.length > 0) {
              setShowProgress(true);
            } else {
              setShowProgress(false);
            }
          },
          error => {
            console.error('Listening for bookings failed: ', error);
            Alert.alert('Error', 'Failed to load your bookings.');
            setLoading(false);
          }
        );
    } else {
      setLoading(false);
    }

    // Set up a timer to update the remaining time
    const timerInterval = setInterval(() => {
      setUserBookings(prevBookings => {
        return prevBookings.map(booking => {
          const expiryTime = booking.expiryTime ? new Date(booking.expiryTime) : null;
          const now = new Date();
          const timeRemaining = expiryTime ? Math.max(0, Math.floor((expiryTime - now) / 1000)) : 0;
          
          return {
            ...booking,
            timeRemaining
          };
        });
      });
    }, 1000); // Update every second

    // Clean up listeners when component unmounts
    return () => {
      unsubscribe();
      clearInterval(timerInterval);
    };
  }, [currentUser]);

  const handleUnbookMachine = async (machine) => {
    try {
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to unbook a machine.');
        return;
      }
      
      if (machine.bookedBy !== currentUser.email) {
        Alert.alert('Error', 'You can only unbook machines that you have booked.');
        return;
      }
      
      // Fetch user reference
      const userQuery = await firestore()
        .collection('students')
        .where('Email', '==', currentUser.email)
        .limit(1)
        .get();
      
      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0].ref;
        const userData = userQuery.docs[0].data();
        
        // Update lastUses array
        let updatedLastUses = userData.lastUses || ["", "", "", "", ""];
        const newEntry = new Date().toISOString();
        updatedLastUses.shift();
        updatedLastUses.push(newEntry);
        
        // Calculate cooldown time (30 seconds from now)
        const cooldownTime = new Date();
        cooldownTime.setSeconds(cooldownTime.getSeconds() + 30);
        
        // Update user with new lastUses and cooldown
        await userDoc.update({
          lastUses: updatedLastUses,
          cooldownUntil: cooldownTime.toISOString()
        });
      }
      
      // Update machine status
      const machineRef = firestore().collection('machines').doc(machine.id);
      await machineRef.update({
        inUse: false,
        bookedBy: null,
        status: 'available',
        lastUsedBy: currentUser.email,
        lastUserName: machine.userName || "",
        lastUserMobile: machine.userMobile || "",
        lastUsedTime: new Date().toISOString(),
        autoUnbooked: false
      });
      
      Alert.alert(
        'Machine Unbooked', 
        'You have successfully unbooked the machine. You can book another machine after 30 seconds.'
      );
    } catch (error) {
      console.error('Error unbooking machine:', error);
      Alert.alert('Error', 'Failed to unbook machine.');
    }
  };

  return {
    userBookings,
    loading,
    showProgress,
    setShowProgress,
    handleUnbookMachine
  };
};

export default useBookings;