// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Animated,
//   Easing
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
// import Svg, { Circle } from 'react-native-svg';

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// const LaundryProgress = ({ navigation, closeProgress }) => {
//   const [booking, setBooking] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const progressAnimation = useState(new Animated.Value(0))[0]; // Properly initialize animation
//   const [timer, setTimer] = useState(null);
//   const currentUser = auth().currentUser;

//   useEffect(() => {
//     let unsubscribe = () => {};
//     let progressInterval;

//     if (currentUser) {
//       // Set up real-time listener for the user's active booking
//       unsubscribe = firestore()
//         .collection('machines')
//         .where('inUse', '==', true)
//         .where('bookedBy', '==', currentUser.email)
//         .onSnapshot(
//           snapshot => {
//             if (!snapshot.empty) {
//               const bookingData = snapshot.docs[0].data();
//               const machineId = snapshot.docs[0].id;
              
//               // Get booking times
//               const expiryTime = bookingData.expiryTime ? new Date(bookingData.expiryTime) : null;
//               const bookingTime = bookingData.bookingTime ? 
//                   (bookingData.bookingTime.toDate ? bookingData.bookingTime.toDate() : new Date(bookingData.bookingTime)) 
//                   : new Date();
              
//               // Store booking info
//               setBooking({
//                 id: machineId,
//                 expiryTime,
//                 bookingTime,
//                 ...bookingData
//               });
              
//               // Clear previous interval if any
//               if (progressInterval) {
//                 clearInterval(progressInterval);
//               }
              
//               // Set up progress interval
//               if (expiryTime) {
//                 progressInterval = setInterval(() => {
//                   const now = new Date();
//                   const totalDuration = expiryTime - bookingTime;
//                   const elapsed = now - bookingTime;
                  
//                   // Calculate progress percentage (capped between 0-100)
//                   const calculatedProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
//                   const roundedProgress = Math.round(calculatedProgress);
                  
//                   setProgress(roundedProgress);
                  
//                   // Animate progress
//                   Animated.timing(progressAnimation, {
//                     toValue: calculatedProgress / 100,
//                     duration: 300,
//                     easing: Easing.out(Easing.ease),
//                     useNativeDriver: false
//                   }).start();
                  
//                   // If booking is complete
//                   if (calculatedProgress >= 100) {
//                     clearInterval(progressInterval);
//                   }
//                 }, 1000);
                
//                 setTimer(progressInterval);
//               }
//             } else {
//               // No active booking, go back to Bookings
//               setBooking(null);
//               // Use goBack() instead of navigate to avoid the navigation error
//               closeProgress(); // Use the closeProgress function passed as prop
//             }
//           },
//           error => {
//             console.error('Error fetching active booking:', error);
//           }
//         );
//     }

//     return () => {
//       unsubscribe();
//       if (timer) {
//         clearInterval(timer);
//       }
//     };
//   }, [currentUser, closeProgress, progressAnimation]);

//   const handleEndBooking = async () => {
//     if (!booking) return;
    
//     try {
//       const machineRef = firestore().collection('machines').doc(booking.id);
//       const userQuerySnapshot = await firestore()
//         .collection('students')
//         .where('Email', '==', currentUser.email)
//         .limit(1)
//         .get();
      
//       if (!userQuerySnapshot.empty) {
//         const userDoc = userQuerySnapshot.docs[0].ref;
//         const userData = userQuerySnapshot.docs[0].data();
        
//         let updatedLastUses = userData.lastUses || ["", "", "", "", ""];
//         const newEntry = new Date().toISOString();
        
//         // Shift array and add new entry
//         updatedLastUses.shift();
//         updatedLastUses.push(newEntry);
        
//         // Update user's lastUses
//         await userDoc.update({
//           lastUses: updatedLastUses,
//         });
//       }
      
//       // Update machine status
//       await machineRef.update({
//         inUse: false,
//         bookedBy: null,
//         status: 'available',
//         lastUsedBy: currentUser.email,
//         lastUserName: booking.userName || '',
//         lastUserMobile: booking.userMobile || '',
//         lastUsedTime: new Date().toISOString(),
//         autoUnbooked: false // Manually unbooked
//       });
      
//       // Close the progress view instead of navigating
//       closeProgress();
      
//     } catch (error) {
//       console.error('Error ending booking:', error);
//     }
//   };

//   // Calculate the circle circumference and the offset for the progress
//   const circleCircumference = 2 * Math.PI * 45; // radius is 45

//   if (!booking) {
//     return null;
//   }

//   return (
//     <View style={styles.container}>
//       {/* Close button */}
//       <TouchableOpacity style={styles.closeButton} onPress={closeProgress}>
//         <Text style={styles.closeButtonText}>✕</Text>
//       </TouchableOpacity>

//       <Text style={styles.heading}>Laundry started!</Text>
//       <Text style={styles.subheading}>We will notify when its done!</Text>

//       {/* Progress circle */}
//       <View style={styles.progressContainer}>
//         <View style={styles.circleWrapper}>
//           <Svg height="120" width="120" viewBox="0 0 100 100">
//             {/* Background circle */}
//             <Circle
//               cx="50"
//               cy="50"
//               r="45"
//               stroke="#E6E6E6"
//               strokeWidth="10"
//               fill="transparent"
//             />
//             {/* Progress circle */}
//             <AnimatedCircle
//               cx="50"
//               cy="50"
//               r="45"
//               stroke="#4051B5"
//               strokeWidth="10"
//               fill="transparent"
//               strokeDasharray={circleCircumference}
//               strokeDashoffset={progressAnimation.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [circleCircumference, 0]
//               })}
//               strokeLinecap="round"
//               transform="rotate(-90, 50, 50)"
//             />
//           </Svg>
//           <View style={styles.percentageContainer}>
//             <Text style={styles.completed}>Completed</Text>
//             <Text style={styles.percentageText}>{progress}%</Text>
//           </View>
//         </View>
//       </View>

//       {/* Mascot image */}
//       <View style={styles.mascotContainer}>
//         <Image
//           source={require('../assets/laundry-mascots.png')}
//           style={styles.mascotImage}
//           resizeMode="contain"
//         />
//       </View>

//       {/* End booking button */}
//       <TouchableOpacity style={styles.endButton} onPress={handleEndBooking}>
//         <View style={styles.endButtonContent}>
//           <Image
//             source={require('../assets/close-circle.png')}
//             style={styles.buttonIcon}
//           />
//           <Text style={styles.endButtonText}>END BOOKING</Text>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     paddingTop: 60,
//     paddingHorizontal: 20,
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8EAF6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 10,
//   },
//   closeButtonText: {
//     fontSize: 20,
//     color: '#4051B5',
//   },
//   heading: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subheading: {
//     fontSize: 18,
//     color: '#666',
//     marginBottom: 60,
//   },
//   progressContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   circleWrapper: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 120,
//     width: 120,
//   },
//   percentageContainer: {
//     position: 'absolute',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   completed: {
//     fontSize: 12,
//     color: '#666',
//   },
//   percentageText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//   },
//   mascotContainer: {
//     marginVertical: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   mascotImage: {
//     width: 200,
//     height: 150,
//   },
//   endButton: {
//     backgroundColor: '#F5F5F5',
//     borderRadius: 8,
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     width: '90%',
//     marginTop: 40,
//     alignItems: 'center',
//   },
//   endButtonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   buttonIcon: {
//     width: 24,
//     height: 24,
//     marginRight: 8,
//     tintColor: '#4051B5',
//   },
//   endButtonText: {
//     color: '#4051B5',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default LaundryProgress;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  StatusBar,
  Platform,
  SafeAreaView
} from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const LaundryProgress = ({ navigation, closeProgress }) => {
  const [booking, setBooking] = useState(null);
  const [progress, setProgress] = useState(0);
  const progressAnimation = useState(new Animated.Value(0))[0]; // Properly initialize animation
  const [timer, setTimer] = useState(null);
  const currentUser = auth().currentUser;

  useEffect(() => {
    let unsubscribe = () => {};
    let progressInterval;

    if (currentUser) {
      // Set up real-time listener for the user's active booking
      unsubscribe = firestore()
        .collection('machines')
        .where('inUse', '==', true)
        .where('bookedBy', '==', currentUser.email)
        .onSnapshot(
          snapshot => {
            if (!snapshot.empty) {
              const bookingData = snapshot.docs[0].data();
              const machineId = snapshot.docs[0].id;
              
              // Get booking times
              const expiryTime = bookingData.expiryTime ? new Date(bookingData.expiryTime) : null;
              const bookingTime = bookingData.bookingTime ? 
                  (bookingData.bookingTime.toDate ? bookingData.bookingTime.toDate() : new Date(bookingData.bookingTime)) 
                  : new Date();
              
              // Store booking info
              setBooking({
                id: machineId,
                expiryTime,
                bookingTime,
                ...bookingData
              });
              
              // Clear previous interval if any
              if (progressInterval) {
                clearInterval(progressInterval);
              }
              
              // Set up progress interval
              if (expiryTime) {
                progressInterval = setInterval(() => {
                  const now = new Date();
                  const totalDuration = expiryTime - bookingTime;
                  const elapsed = now - bookingTime;
                  
                  // Calculate progress percentage (capped between 0-100)
                  const calculatedProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
                  const roundedProgress = Math.round(calculatedProgress);
                  
                  setProgress(roundedProgress);
                  
                  // Animate progress
                  Animated.timing(progressAnimation, {
                    toValue: calculatedProgress / 100,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: false
                  }).start();
                  
                  // If booking is complete
                  if (calculatedProgress >= 100) {
                    clearInterval(progressInterval);
                  }
                }, 1000);
                
                setTimer(progressInterval);
              }
            } else {
              // No active booking, go back to Bookings
              setBooking(null);
              // Use goBack() instead of navigate to avoid the navigation error
              closeProgress(); // Use the closeProgress function passed as prop
            }
          },
          error => {
            console.error('Error fetching active booking:', error);
          }
        );
    }

    return () => {
      unsubscribe();
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentUser, closeProgress, progressAnimation]);

  // Calculate the circle circumference and the offset for the progress
  const circleCircumference = 2 * Math.PI * 45; // radius is 45

  if (!booking) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={closeProgress}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Laundry started!</Text>
        <Text style={styles.subheading}>We will notify when it's done!</Text>

        {/* Progress circle */}
        <View style={styles.progressContainer}>
          <View style={styles.circleWrapper}>
            <Svg height="120" width="120" viewBox="0 0 100 100">
              {/* Background circle */}
              <Circle
                cx="50"
                cy="50"
                r="45"
                stroke="#E6E6E6"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress circle */}
              <AnimatedCircle
                cx="50"
                cy="50"
                r="45"
                stroke="#4051B5"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circleCircumference}
                strokeDashoffset={progressAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [circleCircumference, 0]
                })}
                strokeLinecap="round"
                transform="rotate(-90, 50, 50)"
              />
            </Svg>
            <View style={styles.percentageContainer}>
              <Text style={styles.completed}>Completed</Text>
              <Text style={styles.percentageText}>{progress}%</Text>
            </View>
          </View>
        </View>

        {/* Mascot image */}
        <View style={styles.mascotContainer}>
          <Image
            source={require('../assets/laundry-mascots.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
        
        {/* Information text */}
        <Text style={styles.infoText}>
          Your laundry is in progress. Please wait until it completes.
        </Text>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EAF6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#4051B5',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 40,
  },
  subheading: {
    fontSize: 18,
    color: '#666',
    marginBottom: 60,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  circleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    width: 120,
  },
  percentageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completed: {
    fontSize: 12,
    color: '#666',
  },
  percentageText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  mascotContainer: {
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascotImage: {
    width: 200,
    height: 150,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  }
});

export default LaundryProgress;