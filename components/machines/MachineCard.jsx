// // import React, { useState, useEffect } from 'react';
// // import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import useTimer from '../../hooks/useTimer';

// // const MachineCard = ({
// //   machine,
// //   onPress,
// //   onUnbook,
// //   booked,
// //   maintenance,
// //   getTimeRemaining,
// //   isCurrentUserBooking,
// //   disabled,
// //   electricityShortage,
// // }) => {
// //   const timeRemaining = useTimer(
// //     booked && machine.expiryTime ? getTimeRemaining(machine.expiryTime, machine.isPaused ? machine.pausedTime || 0 : 0) : 0,
// //     booked && machine.expiryTime
// //   );

// //   return (
// //     <TouchableOpacity
// //       style={[
// //         styles.machineCard,
// //         booked && styles.bookedMachine,
// //         maintenance && styles.maintenanceMachine,
// //         disabled && !booked && !maintenance && styles.disabledMachine,
// //         electricityShortage && styles.electricityShortageCard,
// //       ]}
// //       onPress={onPress}
// //       disabled={booked || maintenance || disabled || electricityShortage}
// //     >
// //       <Image
// //         source={require('../../assets/image.png')}
// //         style={[
// //           styles.machineIcon,
// //           electricityShortage && styles.grayScaleImage,
// //         ]}
// //       />

// //       <Text style={styles.machineText}>No. {machine.number}</Text>

// //       {electricityShortage && (
// //         <View style={styles.noPowerContainer}>
// //           <View style={styles.noPowerInlineContent}>
// //             <Icon name="warning" size={20} color="#FFA500" />
// //             <Text style={styles.noPowerText}>NO POWER</Text>
// //           </View>
// //         </View>
// //       )}

// //       {!electricityShortage && (
// //         <>
// //           {booked && (
// //             <View style={styles.bookedInfo}>
// //               {machine.expiryTime && (
// //                 <Text style={styles.timerText}>
// //                   {timeRemaining > 0
// //                     ? `${timeRemaining}s remaining`
// //                     : 'Time expired'}
// //                 </Text>
// //               )}
// //               <Text style={styles.bookedByText}>In use</Text>

// //               {isCurrentUserBooking && (
// //                 <TouchableOpacity
// //                   style={styles.unbookButton}
// //                   onPress={onUnbook}>
// //                   <Text style={styles.unbookButtonText}>Unbook</Text>
// //                 </TouchableOpacity>
// //               )}
// //             </View>
// //           )}

// //           {maintenance && (
// //             <View style={styles.maintenanceInfo}>
// //               <Text style={styles.maintenanceText}>Under Maintenance</Text>
// //             </View>
// //           )}

// //           {!booked && !maintenance && machine.autoUnbooked === true && (
// //             <View style={styles.lastUserInfo}>
// //               <Text style={styles.lastUserText}>Last used by:</Text>
// //               <Text style={styles.lastUserName}>{machine.lastUserName}</Text>
// //               <Text style={styles.lastUserMobile}>
// //                 {machine.lastUserMobile}
// //               </Text>
// //             </View>
// //           )}
// //         </>
// //       )}
// //     </TouchableOpacity>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   machineCard: {
// //     width: '45%',
// //     backgroundColor: 'white',
// //     padding: 20,
// //     borderRadius: 10,
// //     alignItems: 'center',
// //     marginBottom: 15,
// //     elevation: 3,
// //   },
// //   bookedMachine: {
// //     backgroundColor: '#f0f0f0',
// //   },
// //   maintenanceMachine: {
// //     backgroundColor: '#FCFAE8',
// //   },
// //   disabledMachine: {
// //     opacity: 0.7,
// //   },
// //   machineIcon: {
// //     width: 40,
// //     height: 40,
// //     marginBottom: 10,
// //   },
// //   machineText: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginBottom: 5,
// //   },
// //   bookedInfo: {
// //     marginTop: 5,
// //     alignItems: 'center',
// //   },
// //   timerText: {
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     color: '#E53935',
// //     marginBottom: 5,
// //   },
// //   bookedByText: {
// //     fontSize: 12,
// //     color: '#555',
// //   },
// //   maintenanceInfo: {
// //     marginTop: 5,
// //     alignItems: 'center',
// //   },
// //   maintenanceText: {
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     color: '#E53935',
// //   },
// //   lastUserInfo: {
// //     marginTop: 5,
// //     alignItems: 'center',
// //     padding: 5,
// //     backgroundColor: '#f9f9f9',
// //     borderRadius: 5,
// //     width: '100%',
// //   },
// //   lastUserText: {
// //     fontSize: 12,
// //     color: '#555',
// //   },
// //   lastUserName: {
// //     fontSize: 13,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   lastUserMobile: {
// //     fontSize: 12,
// //     color: '#666',
// //   },
// //   unbookButton: {
// //     marginTop: 8,
// //     backgroundColor: '#3D4EB0',
// //     paddingVertical: 5,
// //     paddingHorizontal: 15,
// //     borderRadius: 5,
// //   },
// //   unbookButtonText: {
// //     color: 'white',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },
// //   electricityShortageCard: {
// //     backgroundColor: '#F5F5F5',
// //     borderColor: '#E0E0E0',
// //     borderWidth: 1,
// //     opacity: 0.6,
// //   },
// //   grayScaleImage: {
// //     tintColor: 'grayscale(100%)',
// //     opacity: 0.5,
// //   },
// //   noPowerContainer: {
// //     marginTop: 10,
// //     alignItems: 'center',
// //     width: '100%',
// //   },
// //   noPowerInlineContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: 3,
// //   },
// //   noPowerText: {
// //     color: '#FFA500',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //     marginTop: 5,
// //   },
// // });

// // export default MachineCard;

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import useTimer from '../../hooks/useTimer';

// const MachineCard = ({
//   machine,
//   onPress,
//   onUnbook,
//   booked,
//   maintenance,
//   pendingOTP,
//   getTimeRemaining,
//   isCurrentUserBooking,
//   disabled,
//   electricityShortage,
// }) => {
//   const timeRemaining = useTimer(
//     booked && machine.expiryTime 
//       ? getTimeRemaining(machine.expiryTime, machine.isPaused ? machine.pausedTime || 0 : 0) 
//       : pendingOTP && machine.otpVerifyExpiryTime 
//         ? getTimeRemaining(machine.otpVerifyExpiryTime) 
//         : 0,
//     (booked && machine.expiryTime) || (pendingOTP && machine.otpVerifyExpiryTime)
//   );

//   return (
//     <TouchableOpacity
//       style={[
//         styles.machineCard,
//         booked && styles.bookedMachine,
//         pendingOTP && styles.pendingOTPMachine,
//         maintenance && styles.maintenanceMachine,
//         disabled && !booked && !maintenance && !pendingOTP && styles.disabledMachine,
//         electricityShortage && styles.electricityShortageCard,
//         isCurrentUserBooking && styles.currentUserMachine,
//       ]}
//       onPress={onPress}
//       disabled={booked || maintenance || disabled || electricityShortage || pendingOTP}
//     >
//       <Image
//         source={require('../../assets/image.png')}
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
//           {pendingOTP && (
//             <View style={styles.pendingOTPInfo}>
//               {machine.otpVerifyExpiryTime && (
//                 <Text style={styles.timerText}>
//                   {timeRemaining > 0
//                     ? `${timeRemaining}s remaining`
//                     : 'Time expired'}
//                 </Text>
//               )}
//               <Text style={styles.pendingOTPText}>Awaiting OTP Verification</Text>

//               {isCurrentUserBooking && machine.otp && (
//                 <View style={styles.otpContainer}>
//                   <Text style={styles.otpLabel}>Your OTP:</Text>
//                   <Text style={styles.otpValue}>{machine.otp}</Text>
//                   <Text style={styles.otpInstructions}>
//                     Show this OTP to admin
//                   </Text>
//                 </View>
//               )}
//             </View>
//           )}

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

//           {!booked && !maintenance && !pendingOTP && machine.autoUnbooked === true && (
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
//   pendingOTPMachine: {
//     backgroundColor: '#f8f8f8',
//     borderColor: '#FF9800',
//     borderWidth: 1,
//   },
//   maintenanceMachine: {
//     backgroundColor: '#FCFAE8',
//   },
//   disabledMachine: {
//     opacity: 0.7,
//   },
//   currentUserMachine: {
//     borderWidth: 2,
//     borderColor: '#3D4EB0',
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
//   bookedInfo: {
//     marginTop: 5,
//     alignItems: 'center',
//   },
//   pendingOTPInfo: {
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
//   pendingOTPText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#FF9800',
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
//   electricityShortageCard: {
//     backgroundColor: '#F5F5F5',
//     borderColor: '#E0E0E0',
//     borderWidth: 1,
//     opacity: 0.6,
//   },
//   grayScaleImage: {
//     tintColor: 'grayscale(100%)',
//     opacity: 0.5,
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
//   otpContainer: {
//     marginTop: 8,
//     padding: 8,
//     backgroundColor: '#F0F4FF',
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#3D4EB0',
//     width: '100%',
//   },
//   otpLabel: {
//     fontSize: 10,
//     color: '#3D4EB0',
//   },
//   otpValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#3D4EB0',
//     letterSpacing: 1,
//     marginVertical: 4,
//     textAlign: 'center',
//   },
//   otpInstructions: {
//     fontSize: 9,
//     color: '#555',
//     fontStyle: 'italic',
//     textAlign: 'center',
//   }
// });

// export default MachineCard;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTimer from '../../hooks/useTimer';

const MachineCard = ({
  machine,
  onPress,
  onUnbook,
  booked,
  maintenance,
  pendingOTP,
  getTimeRemaining,
  isCurrentUserBooking,
  disabled,
  electricityShortage,
}) => {
  const timeRemaining = useTimer(
    booked && machine.expiryTime 
      ? getTimeRemaining(machine.expiryTime, machine.isPaused ? machine.pausedTime || 0 : 0) 
      : pendingOTP && machine.otpVerifyExpiryTime 
        ? getTimeRemaining(machine.otpVerifyExpiryTime) 
        : 0,
    (booked && machine.expiryTime) || (pendingOTP && machine.otpVerifyExpiryTime)
  );

  // Function to check if unbook is available based on verification time
  const canUnbook = () => {
    const verifiedAt = machine.verifiedAt?.toDate?.();
    if (!verifiedAt) return false;
    
    const now = new Date();
    const secondsSinceVerification = Math.floor((now - verifiedAt) / 1000);
    return secondsSinceVerification >= 30;
  };

  // Determine if unbooking is frozen (within 30s of verification)
  const isUnbookFrozen = isCurrentUserBooking && !canUnbook();

  return (
    <TouchableOpacity
      style={[
        styles.machineCard,
        booked && styles.bookedMachine,
        pendingOTP && styles.pendingOTPMachine,
        maintenance && styles.maintenanceMachine,
        disabled && !booked && !maintenance && !pendingOTP && styles.disabledMachine,
        electricityShortage && styles.electricityShortageCard,
        isCurrentUserBooking && styles.currentUserMachine,
      ]}
      onPress={onPress}
      disabled={booked || maintenance || disabled || electricityShortage || pendingOTP}
    >
      <Image
        source={require('../../assets/image.png')}
        style={[
          styles.machineIcon,
          electricityShortage && styles.grayScaleImage,
        ]}
      />

      <Text style={styles.machineText}>No. {machine.number}</Text>

      {electricityShortage && (
        <View style={styles.noPowerContainer}>
          <View style={styles.noPowerInlineContent}>
            <Icon name="warning" size={20} color="#FFA500" />
            <Text style={styles.noPowerText}>NO POWER</Text>
          </View>
        </View>
      )}

      {!electricityShortage && (
        <>
          {pendingOTP && (
            <View style={styles.pendingOTPInfo}>
              {machine.otpVerifyExpiryTime && (
                <Text style={styles.timerText}>
                  {timeRemaining > 0
                    ? `${timeRemaining}s remaining`
                    : 'Time expired'}
                </Text>
              )}
              <Text style={styles.pendingOTPText}>Awaiting OTP Verification</Text>

              {isCurrentUserBooking && machine.otp && (
                <View style={styles.otpContainer}>
                  <Text style={styles.otpLabel}>Your OTP:</Text>
                  <Text style={styles.otpValue}>{machine.otp}</Text>
                  <Text style={styles.otpInstructions}>
                    Show this OTP to admin
                  </Text>
                </View>
              )}
            </View>
          )}

          {booked && (
            <View style={styles.bookedInfo}>
              {machine.expiryTime && (
                <Text style={styles.timerText}>
                  {timeRemaining > 0
                    ? `${timeRemaining}s remaining`
                    : 'Time expired'}
                </Text>
              )}
              <Text style={styles.bookedByText}>In use</Text>

              {isCurrentUserBooking && (
                <>
                  {isUnbookFrozen ? (
                    <View style={styles.disabledUnbookButton}>
                      <Text style={styles.disabledUnbookText}>Wait 30s to unbook</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.unbookButton}
                      onPress={onUnbook}>
                      <Text style={styles.unbookButtonText}>Unbook</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}

          {maintenance && (
            <View style={styles.maintenanceInfo}>
              <Text style={styles.maintenanceText}>Under Maintenance</Text>
            </View>
          )}

          {!booked && !maintenance && !pendingOTP && machine.autoUnbooked === true && (
            <View style={styles.lastUserInfo}>
              <Text style={styles.lastUserText}>Last used by:</Text>
              <Text style={styles.lastUserName}>{machine.lastUserName}</Text>
              <Text style={styles.lastUserMobile}>
                {machine.lastUserMobile}
              </Text>
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  machineCard: {
    width: '45%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  bookedMachine: {
    backgroundColor: '#f0f0f0',
  },
  pendingOTPMachine: {
    backgroundColor: '#f8f8f8',
    borderColor: '#FF9800',
    borderWidth: 1,
  },
  maintenanceMachine: {
    backgroundColor: '#FCFAE8',
  },
  disabledMachine: {
    opacity: 0.7,
  },
  currentUserMachine: {
    borderWidth: 2,
    borderColor: '#3D4EB0',
  },
  machineIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  machineText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookedInfo: {
    marginTop: 5,
    alignItems: 'center',
  },
  pendingOTPInfo: {
    marginTop: 5,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 5,
  },
  bookedByText: {
    fontSize: 12,
    color: '#555',
  },
  pendingOTPText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  maintenanceInfo: {
    marginTop: 5,
    alignItems: 'center',
  },
  maintenanceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53935',
  },
  lastUserInfo: {
    marginTop: 5,
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    width: '100%',
  },
  lastUserText: {
    fontSize: 12,
    color: '#555',
  },
  lastUserName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  lastUserMobile: {
    fontSize: 12,
    color: '#666',
  },
  unbookButton: {
    marginTop: 8,
    backgroundColor: '#3D4EB0',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  unbookButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  disabledUnbookButton: {
    marginTop: 8,
    backgroundColor: '#E0E0E0',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  disabledUnbookText: {
    color: '#757575',
    fontSize: 12,
    fontWeight: 'bold',
  },
  electricityShortageCard: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    opacity: 0.6,
  },
  grayScaleImage: {
    tintColor: 'grayscale(100%)',
    opacity: 0.5,
  },
  noPowerContainer: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  noPowerInlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  noPowerText: {
    color: '#FFA500',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  otpContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F0F4FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3D4EB0',
    width: '100%',
  },
  otpLabel: {
    fontSize: 10,
    color: '#3D4EB0',
  },
  otpValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3D4EB0',
    letterSpacing: 1,
    marginVertical: 4,
    textAlign: 'center',
  },
  otpInstructions: {
    fontSize: 9,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
  }
});

export default MachineCard;