// // import React from 'react';
// // import { View, Text, StyleSheet } from 'react-native';
// // import MachineCard from './MachineCard';

// // const MachineGrid = ({
// //   title,
// //   machines,
// //   onBook,
// //   onUnbook,
// //   getTimeRemaining,
// //   currentUserEmail,
// //   isUserRestricted,
// //   electricityShortage,
// // }) => {
// //   return (
// //     <>
// //       <Text style={styles.sectionTitle}>{title}</Text>
// //       <View style={styles.grid}>
// //         {machines.length > 0 ? (
// //           machines.map((machine) => {
// //             const isBooked = machine.inUse === true;
// //             const isUnderMaintenance = machine.underMaintenance === true;
// //             const isCurrentUserBooking = isBooked && machine.bookedBy === currentUserEmail;
            
// //             return (
// //               <MachineCard
// //                 key={machine.id}
// //                 machine={machine}
// //                 booked={isBooked}
// //                 maintenance={isUnderMaintenance}
// //                 getTimeRemaining={getTimeRemaining}
// //                 isCurrentUserBooking={isCurrentUserBooking}
// //                 disabled={isUserRestricted}
// //                 electricityShortage={electricityShortage}
// //                 onPress={() => !isBooked && !isUnderMaintenance && onBook(machine)}
// //                 onUnbook={() => isCurrentUserBooking && onUnbook(machine)}
// //               />
// //             );
// //           })
// //         ) : (
// //           <Text style={styles.noMachinesText}>No {title.toLowerCase()}</Text>
// //         )}
// //       </View>
// //     </>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //   },
// //   grid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //   },
// //   noMachinesText: {
// //     textAlign: 'center',
// //     fontSize: 16,
// //     color: '#999',
// //     marginVertical: 10,
// //     width: '100%',
// //   },
// // });

// // export default MachineGrid;

// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import MachineCard from './MachineCard';

// const MachineGrid = ({
//   title,
//   machines,
//   onBook,
//   onUnbook,
//   getTimeRemaining,
//   currentUserEmail,
//   isUserRestricted,
//   electricityShortage,
//   isPendingOTP,
// }) => {
//   return (
//     <>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>{title}</Text>
//         <View style={styles.countBadge}>
//           <Text style={styles.countText}>{machines.length}</Text>
//         </View>
//       </View>
      
//       <View style={styles.grid}>
//         {machines.length > 0 ? (
//           machines.map((machine) => {
//             const isBooked = machine.inUse === true;
//             const isUnderMaintenance = machine.underMaintenance === true;
//             const isPendingOTPVerification = machine.pendingOTPVerification === true;
//             const isCurrentUserBooking = (isBooked || isPendingOTPVerification) && machine.bookedBy === currentUserEmail;
            
//             return (
//               <MachineCard
//                 key={machine.id}
//                 machine={machine}
//                 booked={isBooked}
//                 pendingOTP={isPendingOTPVerification}
//                 maintenance={isUnderMaintenance}
//                 getTimeRemaining={getTimeRemaining}
//                 isCurrentUserBooking={isCurrentUserBooking}
//                 disabled={isUserRestricted}
//                 electricityShortage={electricityShortage}
//                 onPress={() => !isBooked && !isUnderMaintenance && !isPendingOTPVerification && onBook(machine)}
//                 onUnbook={() => isCurrentUserBooking && onUnbook(machine)}
//               />
//             );
//           })
//         ) : (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.noMachinesText}>No {title.toLowerCase()}</Text>
//           </View>
//         )}
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   countBadge: {
//     backgroundColor: '#3D4EB0',
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     marginLeft: 10,
//   },
//   countText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   emptyContainer: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 15,
//   },
//   noMachinesText: {
//     textAlign: 'center',
//     fontSize: 16,
//     color: '#999',
//     marginVertical: 10,
//   },
// });

// export default MachineGrid;


import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MachineCard from './MachineCard';

const MachineGrid = ({
  title,
  machines,
  onBook,
  onUnbook,
  getTimeRemaining,
  currentUserEmail,
  isUserRestricted,
  electricityShortage,
  isPendingOTP,
  frozenUnbookMachineId,
}) => {
  const [tick, setTick] = useState(0);

  // Trigger a re-render every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const canUnbook = (machine) => {
    const verifiedAt = machine.verifiedAt?.toDate?.();
    if (!verifiedAt) return false;
    const now = new Date();
    const secondsSinceVerification = Math.floor((now - verifiedAt) / 1000);
    return secondsSinceVerification >= 30;
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{machines.length}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {machines.length > 0 ? (
          machines.map((machine) => {
            const isBooked = machine.inUse === true;
            const isUnderMaintenance = machine.underMaintenance === true;
            const isPendingOTPVerification = machine.pendingOTPVerification === true;
            const isCurrentUserBooking = (isBooked || isPendingOTPVerification) && machine.bookedBy === currentUserEmail;
            const isUnbookFrozen = isCurrentUserBooking && !canUnbook(machine);

            return (
              <MachineCard
                key={machine.id}
                machine={machine}
                booked={isBooked}
                pendingOTP={isPendingOTPVerification}
                maintenance={isUnderMaintenance}
                getTimeRemaining={getTimeRemaining}
                isCurrentUserBooking={isCurrentUserBooking}
                isUnbookFrozen={isUnbookFrozen}
                disabled={isUserRestricted}
                electricityShortage={electricityShortage}
                onPress={() => !isBooked && !isUnderMaintenance && !isPendingOTPVerification && onBook(machine)}
                onUnbook={() => isCurrentUserBooking && !isUnbookFrozen && onUnbook(machine)}
              />
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.noMachinesText}>No {title.toLowerCase()}</Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  countBadge: {
    backgroundColor: '#3D4EB0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  emptyContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  noMachinesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 10,
  },
});

export default MachineGrid;