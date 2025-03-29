// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const MachinePage = () => {
//   const [availableMachines, setAvailableMachines] = useState([]);
//   const [bookedMachines, setBookedMachines] = useState([]);
//   const [maintenanceMachines, setMaintenanceMachines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userHasBooking, setUserHasBooking] = useState(false);
//   const [userCooldownUntil, setUserCooldownUntil] = useState(null);
//   const [penaltyUntil, setPenaltyUntil] = useState(null);
//   const [restrictionSeconds, setRestrictionSeconds] = useState(0);
//   const [restrictionType, setRestrictionType] = useState(null);
//   const currentUser = auth().currentUser;

//   const [hasPenaltyNotification, setHasPenaltyNotification] = useState(false);

//   // new states for electricity
//   const [electricityShortage, setElectricityShortage] = useState(false);
//   const [electricityShortageStartTime, setElectricityShortageStartTime] =
//     useState(null);

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
//           Alert.alert('Error', 'Failed to load machine data.');
//           setLoading(false);
//         },
//       );

//     if (!currentUser) return;
//     const userStatusUnsubscribe = firestore()
//       .collection('students')
//       .where('Email', '==', currentUser.email)
//       .limit(1)
//       .onSnapshot(
//         snapshot => {
//           if (!snapshot.empty) {
//             const userData = snapshot.docs[0].data();
//             const userRef = snapshot.docs[0].ref;

//             // Check for cooldown period
//             if (userData.cooldownUntil) {
//               const cooldownTime = new Date(userData.cooldownUntil);
//               if (cooldownTime > new Date()) {
//                 setUserCooldownUntil(cooldownTime);
//               } else {
//                 setUserCooldownUntil(null);
//               }
//             } else {
//               setUserCooldownUntil(null);
//             }

//             // Check for penalty period
//             if (userData.penaltyUntil) {
//               const penaltyTime = new Date(userData.penaltyUntil);
//               if (penaltyTime > new Date()) {
//                 setPenaltyUntil(penaltyTime);

//                 // Check if there's a pending notification
//                 if (userData.hasPenaltyNotification === true) {
//                   Alert.alert(
//                     'Penalty Applied',
//                     'You did not unbook your machine and it was automatically released. You will not be able to book again for 1 minute.',
//                   );

//                   // Clear the notification flag
//                   userRef.update({hasPenaltyNotification: false});
//                 }
//               } else {
//                 setPenaltyUntil(null);
//               }
//             } else {
//               setPenaltyUntil(null);
//             }
//           }
//         },
//         error => {
//           console.error('Error listening to user status:', error);
//         },
//       );

//     return () => userStatusUnsubscribe();

//     // Clean up the listener when component unmounts
//     return () => unsubscribe();
//   }, [currentUser]);

//   // Set up listener for user cooldown status
//   useEffect(() => {
//     if (!currentUser) return;

//     const userStatusUnsubscribe = firestore()
//       .collection('students')
//       .where('Email', '==', currentUser.email)
//       .limit(1)
//       .onSnapshot(
//         snapshot => {
//           if (!snapshot.empty) {
//             const userData = snapshot.docs[0].data();

//             // Check for cooldown period
//             if (userData.cooldownUntil) {
//               const cooldownTime = new Date(userData.cooldownUntil);
//               if (cooldownTime > new Date()) {
//                 setUserCooldownUntil(cooldownTime);
//               } else {
//                 setUserCooldownUntil(null);
//               }
//             } else {
//               setUserCooldownUntil(null);
//             }

//             // Check for penalty period
//             if (userData.penaltyUntil) {
//               const penaltyTime = new Date(userData.penaltyUntil);
//               if (penaltyTime > new Date()) {
//                 setPenaltyUntil(penaltyTime);
//               } else {
//                 setPenaltyUntil(null);
//               }
//             } else {
//               setPenaltyUntil(null);
//             }
//           }
//         },
//         error => {
//           console.error('Error listening to user status:', error);
//         },
//       );

//     return () => userStatusUnsubscribe();
//   }, [currentUser]);

//   // Add a timer to update cooldown/penalty countdown every second
//   useEffect(() => {
//     const now = new Date();

//     if (penaltyUntil && penaltyUntil > now) {
//       setRestrictionType('penalty');
//       setRestrictionSeconds(Math.ceil((penaltyUntil - now) / 1000));
//     } else if (userCooldownUntil && userCooldownUntil > now) {
//       setRestrictionType('cooldown');
//       setRestrictionSeconds(Math.ceil((userCooldownUntil - now) / 1000));
//     } else {
//       setRestrictionType(null);
//       setRestrictionSeconds(0);
//     }

//     const timer = setInterval(() => {
//       const currentTime = new Date();

//       if (penaltyUntil && penaltyUntil > currentTime) {
//         setRestrictionType('penalty');
//         setRestrictionSeconds(Math.ceil((penaltyUntil - currentTime) / 1000));
//       } else if (userCooldownUntil && userCooldownUntil > currentTime) {
//         setRestrictionType('cooldown');
//         setRestrictionSeconds(
//           Math.ceil((userCooldownUntil - currentTime) / 1000),
//         );
//       } else {
//         setRestrictionType(null);
//         setRestrictionSeconds(0);
//       }
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [penaltyUntil, userCooldownUntil]);

//   // new useEffect for electricity.
//   useEffect(() => {
//     // Add a listener for electricity shortage status
//     const electricityStatusUnsubscribe = firestore()
//       .collection('systemStatus')
//       .doc('electricityStatus')
//       .onSnapshot(
//         snapshot => {
//           const data = snapshot.data();
//           if (data) {
//             setElectricityShortage(data.isShortage || false);
//             if (data.startTime) {
//               setElectricityShortageStartTime(data.startTime.toDate());
//             } else {
//               setElectricityShortageStartTime(null);
//             }
//           }
//         },
//         error => {
//           console.error('Error listening to electricity status:', error);
//         },
//       );

//     return () => {
//       electricityStatusUnsubscribe();
//     };
//   }, [currentUser]);

//   const handleBookMachine = async machine => {
//     if (electricityShortage) {
//       Alert.alert(
//         'Service Unavailable',
//         'Machine booking is paused due to electricity shortage.',
//       );
//       return;
//     }
//     try {
//       if (!currentUser) {
//         Alert.alert('Error', 'You must be logged in to book a machine.');
//         return;
//       }

//       if (machine.inUse) {
//         return; // Do nothing if the machine is already booked
//       }

//       // Check if user already has a booking
//       if (userHasBooking) {
//         Alert.alert('Error', 'You can only book one machine at a time.');
//         return;
//       }

//       // Check if user is in a cooldown period
//       if (restrictionType === 'cooldown' && restrictionSeconds > 0) {
//         Alert.alert(
//           'Booking not allowed',
//           `You need to wait ${restrictionSeconds} seconds before booking another machine.`,
//         );
//         return;
//       }

//       // Check if user is under penalty
//       if (restrictionType === 'penalty' && restrictionSeconds > 0) {
//         Alert.alert(
//           'Booking restricted',
//           `You have been penalized for not unbooking a machine. Please wait ${restrictionSeconds} seconds.`,
//         );
//         return;
//       }

//       // Fetch user details from students collection
//       const userQuery = await firestore()
//         .collection('students')
//         .where('Email', '==', currentUser.email)
//         .limit(1)
//         .get();

//       let userDetails = {};
//       let userDocRef = null;

//       if (!userQuery.empty) {
//         userDocRef = userQuery.docs[0].ref;
//         userDetails = userQuery.docs[0].data();
//       } else {
//         Alert.alert('Error', 'User profile not found.');
//         return;
//       }

//       // Calculate expiry time (45 seconds from now)
//       const expiryTime = new Date();
//       expiryTime.setSeconds(expiryTime.getSeconds() + 45);

//       const machineRef = firestore().collection('machines').doc(machine.id);

//       // Fetch current machine data to update lastUses
//       const machineDoc = await machineRef.get();
//       const machineData = machineDoc.data();

//       // Prepare updated lastUses array (last 3 users)
//       const updatedLastUses = machineData.lastUses || [];
//       const newUserEntry = {
//         email: currentUser.email,
//         name: userDetails.Name || '',
//         mobile: userDetails.MobileNo || '',
//         timestamp: new Date().toISOString(),
//       };

//       // Only add new user if not already the most recent user
//       if (
//         !updatedLastUses.length ||
//         updatedLastUses[0].email !== currentUser.email
//       ) {
//         // Shift existing entries down
//         if (updatedLastUses.length >= 3) {
//           updatedLastUses.pop(); // Remove the oldest entry
//         }
//         updatedLastUses.unshift(newUserEntry);
//       }

//       await machineRef.update({
//         inUse: true,
//         bookedBy: currentUser.email,
//         bookingTime: firestore.FieldValue.serverTimestamp(),
//         status: 'in-use',
//         expiryTime: expiryTime.toISOString(),
//         userName: userDetails.Name || '',
//         userMobile: userDetails.MobileNo || '',
//         autoUnbooked: false,
//         lastUses: updatedLastUses,
//       });

//       // Set a timer to auto-unbook the machine
//       setTimeout(() => {
//         autoUnbookMachine(machine.id, currentUser.email);
//       }, 45000); // 45 seconds

//       Alert.alert(`Success! Machine No. ${machine.number} booked!`);
//     } catch (error) {
//       console.error('Error booking machine:', error);
//       Alert.alert('Error', 'Failed to book machine.');
//     }
//   };

//   const autoUnbookMachine = async (machineId, userEmail) => {
//     try {
//       const machineDoc = await firestore()
//         .collection('machines')
//         .doc(machineId)
//         .get();
//       const machineData = machineDoc.data();

//       if (!machineData || machineData.bookedBy !== userEmail) {
//         return;
//       }

//       // Fetch user details from Firestore
//       const userQuerySnapshot = await firestore()
//         .collection('students')
//         .where('Email', '==', userEmail)
//         .limit(1)
//         .get();

//       let lastUserName = 'Unknown User';
//       let updatedLastUses = ['', '', '', '', ''];

//       if (!userQuerySnapshot.empty) {
//         const userDoc = userQuerySnapshot.docs[0].ref;
//         const userData = userQuerySnapshot.docs[0].data();

//         lastUserName = userData.Name || 'Unknown';

//         updatedLastUses = userData.lastUses || ['', '', '', '', ''];
//         const newEntry = new Date().toISOString();
//         updatedLastUses.shift();
//         updatedLastUses.push(newEntry);

//         // Calculate penalty time (1 minute from now)
//         const penaltyTime = new Date();
//         penaltyTime.setMinutes(penaltyTime.getMinutes() + 1);

//         // Update user's lastUses list and add penalty
//         await userDoc.update({
//           lastUses: updatedLastUses,
//           penaltyUntil: penaltyTime.toISOString(),
//           hasPenaltyNotification: true, // Add a flag to indicate pending notification
//         });
//       }

//       await firestore().collection('machines').doc(machineId).update({
//         inUse: false,
//         bookedBy: null,
//         status: 'available',
//         lastUsedBy: userEmail,
//         lastUserName: lastUserName,
//         lastUserMobile: machineData.userMobile,
//         lastUsedTime: new Date().toISOString(),
//         autoUnbooked: true,
//       });

//       console.log(
//         `Machine ${machineId} auto-unbooked. Last user: ${lastUserName}`,
//       );

//       // IMPORTANT: Remove the direct alert here - it's showing for everyone
//       // We'll handle user-specific alerts through the Firestore listener
//     } catch (error) {
//       console.error('Error auto-unbooking machine:', error);
//     }
//   };

//   // Calculate time remaining for a machine

//   const handleUnbookMachine = async machine => {
//     if (electricityShortage) {
//       Alert.alert(
//         'Service Unavailable',
//         'Machine unbooking is paused due to electricity shortage.',
//       );
//       return;
//     }
//     try {
//       if (!currentUser) {
//         Alert.alert('Error', 'You must be logged in to unbook a machine.');
//         return;
//       }

//       if (machine.bookedBy !== currentUser.email) {
//         Alert.alert(
//           'Error',
//           'You can only unbook machines that you have booked.',
//         );
//         return;
//       }

//       // Fetch user reference
//       const userQuery = await firestore()
//         .collection('students')
//         .where('Email', '==', currentUser.email)
//         .limit(1)
//         .get();

//       if (!userQuery.empty) {
//         const userDoc = userQuery.docs[0].ref;
//         const userData = userQuery.docs[0].data();

//         // Update lastUses array
//         let updatedLastUses = userData.lastUses || ['', '', '', '', ''];
//         const newEntry = new Date().toISOString();
//         updatedLastUses.shift();
//         updatedLastUses.push(newEntry);

//         // Calculate cooldown time (30 seconds from now)
//         const cooldownTime = new Date();
//         cooldownTime.setSeconds(cooldownTime.getSeconds() + 30);

//         // Update user with new lastUses and cooldown
//         await userDoc.update({
//           lastUses: updatedLastUses,
//           cooldownUntil: cooldownTime.toISOString(),
//         });
//       }

//       // Update machine status and lastUses
//       const machineRef = firestore().collection('machines').doc(machine.id);

//       // Fetch current machine data to update lastUses
//       const machineDoc = await machineRef.get();
//       const machineData = machineDoc.data();

//       // Prepare updated lastUses array (last 3 users)
//       const updatedLastUses = machineData.lastUses || [];
//       const newUserEntry = {
//         email: currentUser.email,
//         name: machine.userName || '',
//         mobile: machine.userMobile || '',
//         timestamp: new Date().toISOString(),
//       };

//       // Only add new user if not already the most recent user
//       if (
//         !updatedLastUses.length ||
//         updatedLastUses[0].email !== currentUser.email
//       ) {
//         // Shift existing entries down
//         if (updatedLastUses.length >= 3) {
//           updatedLastUses.pop(); // Remove the oldest entry
//         }
//         updatedLastUses.unshift(newUserEntry);
//       }

//       await machineRef.update({
//         inUse: false,
//         bookedBy: null,
//         status: 'available',
//         lastUsedBy: currentUser.email,
//         lastUserName: machine.userName || '',
//         lastUserMobile: machine.userMobile || '',
//         lastUsedTime: new Date().toISOString(),
//         autoUnbooked: false,
//         lastUses: updatedLastUses,
//       });

//       Alert.alert(
//         'Machine Unbooked',
//         'You have successfully unbooked the machine. You can book another machine after 30 seconds.',
//       );
//     } catch (error) {
//       console.error('Error unbooking machine:', error);
//       Alert.alert('Error', 'Failed to unbook machine.');
//     }
//   };

//   // Modify the existing useEffect to pause or extend machine timers
//   useEffect(() => {
//     const updateMachineTimers = async () => {
//       if (!electricityShortage || !electricityShortageStartTime) return;

//       try {
//         // Query for currently booked machines
//         const bookedMachinesQuery = await firestore()
//           .collection('machines')
//           .where('inUse', '==', true)
//           .get();

//         bookedMachinesQuery.forEach(async machineDoc => {
//           const machineData = machineDoc.data();

//           // If machine is in use, extend its expiry time
//           if (machineData.expiryTime) {
//             const currentExpiryTime = new Date(machineData.expiryTime);
//             const newExpiryTime = new Date(
//               currentExpiryTime.getTime() +
//                 (new Date() - electricityShortageStartTime),
//             );

//             await firestore().collection('machines').doc(machineDoc.id).update({
//               expiryTime: newExpiryTime.toISOString(),
//               expiryTime: currentExpiryTime.toISOString(),
//               pausedTime: timePaused,
//               isPaused: true,
//               // electricityShortageExtension: true
//             });
//           }
//         });
//       } catch (error) {
//         console.error('Error updating machine timers:', error);
//       }
//     };

//     updateMachineTimers();
//   }, [electricityShortage, electricityShortageStartTime]);

//   const getTimeRemaining = (expiryTimeStr, pausedTime = 0) => {
//     if (!expiryTimeStr) return 0;

//     const expiryTime = new Date(expiryTimeStr);
//     const now = new Date();
//     const diffMs = expiryTime - now + pausedTime;

//     return Math.max(0, Math.floor(diffMs / 1000)); // Return seconds remaining
//   };

//   const isUserRestricted = restrictionType !== null && restrictionSeconds > 0;

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.heading}>LNMIIT, Jaipur</Text>
//       <Text style={styles.subheading}>
//         {availableMachines.length} machines available
//       </Text>

//       {/* Enhanced Electricity Shortage Banner */}
//       {electricityShortage && (
//         <View style={styles.electricityShortageContainer}>
//           <View style={styles.alertTriangle}>
//             <Icon name="warning" size={24} color="#FFA500" />
//           </View>
//           <View style={styles.electricityShortageTextContainer}>
//             <Text style={styles.electricityShortageTitle}>
//               Electricity Shortage ⚡
//             </Text>
//             <Text style={styles.electricityShortageSubtitle}>
//               All machine services are temporarily suspended
//             </Text>
//           </View>
//         </View>
//       )}

//       {/* Show restriction message if user has a cooldown or penalty */}
//       {isUserRestricted && (
//         <View style={styles.restrictionContainer}>
//           <Text style={styles.restrictionText}>
//             {restrictionType === 'penalty'
//               ? `Penalty: Wait ${restrictionSeconds}s before booking`
//               : `Next Slot: Wait ${restrictionSeconds}s before booking`}
//           </Text>
//         </View>
//       )}

//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#3D4EB0" />
//         </View>
//       ) : (
//         <>
//           <Text style={styles.sectionTitle}>Available washing machines</Text>
//           <View style={styles.grid}>
//             {availableMachines.length > 0 ? (
//               availableMachines.map(machine => (
//                 <MachineCard
//                   key={machine.id}
//                   machine={machine}
//                   onPress={() => handleBookMachine(machine)}
//                   disabled={isUserRestricted}
//                   electricityShortage={electricityShortage} // Add this line
//                 />
//               ))
//             ) : (
//               <Text style={styles.noMachinesText}>No available machines</Text>
//             )}
//           </View>

//           <Text style={styles.sectionTitle}>Booked washing machines</Text>
//           <View style={styles.grid}>
//             {bookedMachines.length > 0 ? (
//               bookedMachines.map(machine => (
//                 <MachineCard
//                   key={machine.id}
//                   machine={machine}
//                   booked
//                   getTimeRemaining={getTimeRemaining}
//                   isCurrentUserBooking={machine.bookedBy === currentUser?.email}
//                   onUnbook={() => handleUnbookMachine(machine)}
//                   electricityShortage={electricityShortage} // Add this line
//                 />
//               ))
//             ) : (
//               <Text style={styles.noMachinesText}>No booked machines</Text>
//             )}
//           </View>

//           <Text style={styles.sectionTitle}>Machines under maintenance</Text>
//           <View style={styles.grid}>
//             {maintenanceMachines.length > 0 ? (
//               maintenanceMachines.map(machine => (
//                 <MachineCard
//                   key={machine.id}
//                   machine={machine}
//                   maintenance
//                   disabled
//                   electricityShortage={electricityShortage} // Add this line
//                 />
//               ))
//             ) : (
//               <Text style={styles.noMachinesText}>
//                 No machines under maintenance
//               </Text>
//             )}
//           </View>
//         </>
//       )}
//     </ScrollView>
//   );
// };

// const MachineCard = ({
//   machine,
//   onPress,
//   onUnbook,
//   booked,
//   maintenance,
//   getTimeRemaining,
//   isCurrentUserBooking,
//   disabled,
//   electricityShortage, // Add this prop
// }) => {
//   const [timeRemaining, setTimeRemaining] = useState(0);

//   useEffect(() => {
//     let timer;
//     if (booked && machine.expiryTime) {
//       // Calculate paused time if machine was paused during electricity shortage
//       const pausedTime = machine.isPaused ? machine.pausedTime || 0 : 0;

//       // Set initial time
//       setTimeRemaining(getTimeRemaining(machine.expiryTime));

//       // Update timer every second
//       timer = setInterval(() => {
//         const remaining = getTimeRemaining(machine.expiryTime, pausedTime);
//         setTimeRemaining(remaining);
//         if (remaining <= 0) {
//           clearInterval(timer);
//         }
//       }, 1000);
//     }

//     return () => {
//       if (timer) clearInterval(timer);
//     };
//   }, [
//     booked,
//     machine.expiryTime,
//     getTimeRemaining,
//     machine.isPaused,
//     machine.pausedTime,
//   ]);

//   return (
//     <TouchableOpacity
//       style={[
//         styles.machineCard,
//         booked && styles.bookedMachine,
//         maintenance && styles.maintenanceMachine,
//         disabled && !booked && !maintenance && styles.disabledMachine,
//         electricityShortage && styles.electricityShortageCard,
//       ]}
//       onPress={onPress}
//       disabled={booked || maintenance || disabled || electricityShortage} // Disable press if conditions met
//     >
//       <Image
//         source={require('../assets/image.png')}
//         style={[
//           styles.machineIcon,
//           electricityShortage && styles.grayScaleImage,
//         ]}
//       />

//       <Text style={styles.machineText}>No. {machine.number}</Text>

//       {electricityShortage && (
//         <View style={styles.noPowerContainer}>
//           <View style={styles.noPowerInlineContent}>
//             <Icon name="warning" size={20} color="#FFA500" />
//             <Text style={styles.noPowerText}>NO POWER</Text>
//           </View>
//         </View>
//       )}

//       {!electricityShortage && (
//         <>
//           {booked && (
//             <View style={styles.bookedInfo}>
//               {machine.expiryTime && (
//                 <Text style={styles.timerText}>
//                   {timeRemaining > 0
//                     ? `${timeRemaining}s remaining`
//                     : 'Time expired'}
//                 </Text>
//               )}
//               <Text style={styles.bookedByText}>In use</Text>

//               {isCurrentUserBooking && (
//                 <TouchableOpacity
//                   style={styles.unbookButton}
//                   onPress={onUnbook}>
//                   <Text style={styles.unbookButtonText}>Unbook</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {maintenance && (
//             <View style={styles.maintenanceInfo}>
//               <Text style={styles.maintenanceText}>Under Maintenance</Text>
//             </View>
//           )}

//           {!booked && !maintenance && machine.autoUnbooked === true && (
//             <View style={styles.lastUserInfo}>
//               <Text style={styles.lastUserText}>Last used by:</Text>
//               <Text style={styles.lastUserName}>{machine.lastUserName}</Text>
//               <Text style={styles.lastUserMobile}>
//                 {machine.lastUserMobile}
//               </Text>
//             </View>
//           )}
//         </>
//       )}
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: '#F5F5F5', padding: 20},
//   heading: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 5,
//   },
//   subheading: {
//     fontSize: 14,
//     color: 'green',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   machineCard: {
//     width: '45%',
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginBottom: 15,
//     elevation: 3,
//   },
//   bookedMachine: {
//     backgroundColor: '#f0f0f0',
//   },
//   maintenanceMachine: {
//     backgroundColor: '#FCFAE8',
//   },
//   disabledMachine: {
//     opacity: 0.7,
//   },
//   machineIcon: {
//     width: 40,
//     height: 40,
//     marginBottom: 10,
//   },
//   machineText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   noMachinesText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#999',
//     marginVertical: 10,
//   },
//   bookedInfo: {
//     marginTop: 5,
//     alignItems: 'center',
//   },
//   timerText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#E53935',
//     marginBottom: 5,
//   },
//   bookedByText: {
//     fontSize: 12,
//     color: '#555',
//   },
//   maintenanceInfo: {
//     marginTop: 5,
//     alignItems: 'center',
//   },
//   maintenanceText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#E53935',
//   },
//   lastUserInfo: {
//     marginTop: 5,
//     alignItems: 'center',
//     padding: 5,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 5,
//     width: '100%',
//   },
//   lastUserText: {
//     fontSize: 12,
//     color: '#555',
//   },
//   lastUserName: {
//     fontSize: 13,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   lastUserMobile: {
//     fontSize: 12,
//     color: '#666',
//   },
//   unbookButton: {
//     marginTop: 8,
//     backgroundColor: '#3D4EB0',
//     paddingVertical: 5,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   unbookButtonText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   restrictionContainer: {
//     backgroundColor: '#FFECB3',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15,
//   },
//   restrictionText: {
//     textAlign: 'center',
//     fontWeight: 'bold',
//     color: '#E65100',
//   },
//   electricityShortageContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF3CD',
//     borderRadius: 10,
//     padding: 15,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: '#FFC107',
//   },
//   alertTriangle: {
//     marginRight: 15,
//   },
//   electricityShortageTextContainer: {
//     flex: 1,
//   },
//   electricityShortageTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#856404',
//   },
//   electricityShortageSubtitle: {
//     fontSize: 14,
//     color: '#856404',
//   },
//   electricityShortageCard: {
//     opacity: 0.5,
//     backgroundColor: '#F0F0F0',
//   },
//   grayScaleImage: {
//     tintColor: 'grayscale(100%)',
//   },
//   noPowerOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 255, 255, 0.8)',
//   },
//   noPowerContainer: {
//     marginTop: 10,
//     alignItems: 'center',
//     width: '100%',
//   },
//   noPowerInlineContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 3,
//   },
//   noPowerText: {
//     color: '#FFA500',
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginTop: 5,
//   },
//   electricityShortageCard: {
//     backgroundColor: '#F5F5F5', // More subtle grayish background
//     borderColor: '#E0E0E0',
//     borderWidth: 1,
//     opacity: 0.6, // Reduced opacity to give a frozen feel
//   },
//   grayScaleImage: {
//     tintColor: 'grayscale(100%)',
//     opacity: 0.5,
//   },
// });

// export default MachinePage;

import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

// Custom hooks
import useMachines from '../hooks/useMachines';
import useUserStatus from '../hooks/useUserStatus';
import useElectricityStatus from '../hooks/useElectricityStatus';

// Components
import { MachineGrid, ElectricityShortageAlert, RestrictionAlert } from '../components/machines';
import { PageHeader, LoadingIndicator } from '../components/common';

// Services
import machineService from '../services/machineService';
import userService from '../services/userService';

// Utils
import { getTimeRemaining } from '../utils/timeUtils';

const MachinePage = () => {
  const currentUser = auth().currentUser;
  
  // Get machine data using custom hook
  const { 
    availableMachines, 
    bookedMachines, 
    maintenanceMachines, 
    loading,
    userHasBooking,
    refreshMachines
  } = useMachines();
  
  // Get user status using custom hook
  const {
    userCooldownUntil,
    penaltyUntil,
    restrictionSeconds,
    restrictionType,
  } = useUserStatus(currentUser?.email);
  
  // Get electricity status using custom hook
  const { electricityShortage, electricityShortageStartTime } = useElectricityStatus();

  const handleBookMachine = async (machine) => {
    if (electricityShortage) {
      Alert.alert(
        'Service Unavailable',
        'Machine booking is paused due to electricity shortage.'
      );
      return;
    }
    
    try {
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to book a machine.');
        return;
      }

      if (machine.inUse) return;

      if (userHasBooking) {
        Alert.alert('Error', 'You can only book one machine at a time.');
        return;
      }

      if (restrictionType === 'cooldown' && restrictionSeconds > 0) {
        Alert.alert(
          'Booking not allowed',
          `You need to wait ${restrictionSeconds} seconds before booking another machine.`
        );
        return;
      }

      if (restrictionType === 'penalty' && restrictionSeconds > 0) {
        Alert.alert(
          'Booking restricted',
          `You have been penalized for not unbooking a machine. Please wait ${restrictionSeconds} seconds.`
        );
        return;
      }

      await machineService.bookMachine(machine.id, currentUser.email);
      Alert.alert(`Success! Machine No. ${machine.number} booked!`);
      refreshMachines();
      
    } catch (error) {
      console.error('Error booking machine:', error);
      Alert.alert('Error', 'Failed to book machine.');
    }
  };

  const handleUnbookMachine = async (machine) => {
    if (electricityShortage) {
      Alert.alert(
        'Service Unavailable',
        'Machine unbooking is paused due to electricity shortage.'
      );
      return;
    }
    
    try {
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to unbook a machine.');
        return;
      }

      if (machine.bookedBy !== currentUser.email) {
        Alert.alert('Error', 'You can only unbook machines that you have booked.');
        return;
      }

      await machineService.unbookMachine(machine.id, currentUser.email);
      Alert.alert(
        'Machine Unbooked',
        'You have successfully unbooked the machine. You can book another machine after 30 seconds.'
      );
      refreshMachines();
      
    } catch (error) {
      console.error('Error unbooking machine:', error);
      Alert.alert('Error', 'Failed to unbook machine.');
    }
  };

  const isUserRestricted = restrictionType !== null && restrictionSeconds > 0;

  return (
    <ScrollView style={styles.container}>
      <PageHeader 
        title="LNMIIT, Jaipur" 
        subtitle={`${availableMachines.length} machines available`} 
        subtitleColor="green"
      />

      <ElectricityShortageAlert isActive={electricityShortage} />
      <RestrictionAlert type={restrictionType} seconds={restrictionSeconds} />

      {loading ? (
        <LoadingIndicator />
      ) : (
        <>
          <MachineGrid
            title="Available washing machines"
            machines={availableMachines}
            onBook={handleBookMachine}
            currentUserEmail={currentUser?.email}
            isUserRestricted={isUserRestricted}
            electricityShortage={electricityShortage}
            getTimeRemaining={getTimeRemaining}
          />

          <MachineGrid
            title="Booked washing machines"
            machines={bookedMachines}
            onUnbook={handleUnbookMachine}
            currentUserEmail={currentUser?.email}
            isUserRestricted={isUserRestricted}
            electricityShortage={electricityShortage}
            getTimeRemaining={getTimeRemaining}
          />

          <MachineGrid
            title="Machines under maintenance"
            machines={maintenanceMachines}
            currentUserEmail={currentUser?.email}
            isUserRestricted={isUserRestricted}
            electricityShortage={electricityShortage}
            getTimeRemaining={getTimeRemaining}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
});

export default MachinePage