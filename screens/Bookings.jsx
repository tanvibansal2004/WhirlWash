// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   SafeAreaView,
//   Platform,
//   StatusBar,
// } from 'react-native';
// import LaundryProgress from './LaundryProgress';
// import BookingCard from '../components/BookingCard';
// import HistoryCard from '../components/HistoryCard';
// import EmptyState from '../components/EmptyState';
// import SectionHeader from '../components/SectionHeader';
// import useBookings from '../hooks/useBookings';
// import useUsageHistory from '../hooks/useUsageHistory';
// import { formatDate, formatTimeRemaining } from '../utils/dateFormatter';

// const Bookings = ({ navigation }) => {
//   const {
//     userBookings,
//     loading,
//     showProgress,
//     setShowProgress,
//     handleUnbookMachine
//   } = useBookings();

//   const {
//     lastUses,
//     usageHistoryLoading,
//     showHistorySection
//   } = useUsageHistory();

//   // If showing progress view, render the LaundryProgress component
//   if (showProgress) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <LaundryProgress 
//           navigation={navigation} 
//           closeProgress={() => setShowProgress(false)} 
//         />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
//       <ScrollView
//         contentContainerStyle={styles.contentContainer}
//         style={styles.container}
//         showsVerticalScrollIndicator={true}
//       >
//         <SectionHeader 
//           title="Your Bookings" 
//           subtitle={`${userBookings.length} active bookings`} 
//         />

//         {loading ? (
//           <View style={styles.loaderContainer}>
//             <ActivityIndicator size="large" color="#3D4EB0" />
//           </View>
//         ) : (
//           <View style={styles.bookingsContainer}>
//             {userBookings.length > 0 ? (
//               userBookings.map(machine => (
//                 <BookingCard
//                   key={machine.id}
//                   machine={machine}
//                   formatTimeRemaining={formatTimeRemaining}
//                   formatDate={formatDate}
//                   onUnbook={handleUnbookMachine}
//                 />
//               ))
//             ) : (
//               <EmptyState message="You don't have any active bookings" />
//             )}
//           </View>
//         )}

//         {/* Last Usage History Section */}
//         {showHistorySection && (
//           <>
//             <SectionHeader 
//               title="Your Usage History" 
//               subtitle={`Last ${lastUses.length} uses`}
//               marginTop={30}
//             />
            
//             {usageHistoryLoading ? (
//               <View style={styles.loaderContainer}>
//                 <ActivityIndicator size="large" color="#3D4EB0" />
//               </View>
//             ) : (
//               <View style={styles.bookingsContainer}>
//                 {lastUses.map((useDate, index) => (
//                   <HistoryCard 
//                     key={index}
//                     useDate={useDate}
//                     formatDate={formatDate}
//                     index={index}
//                   />
//                 ))}
//               </View>
//             )}
//           </>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//     paddingHorizontal: 20,
//   },
//   contentContainer: {
//     paddingTop: 10,
//     paddingBottom: 90, // Extra padding to account for bottom tab navigation
//   },
//   loaderContainer: {
//     padding: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: 150, // Minimum height to prevent layout jumps
//   },
//   bookingsContainer: {
//     marginTop: 10,
//   },
// });

// export default Bookings;

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import LaundryProgress from './LaundryProgress';
import BookingCard from '../components/BookingCard';
import HistoryCard from '../components/HistoryCard';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';
import useBookings from '../hooks/useBookings';
import useUsageHistory from '../hooks/useUsageHistory';
import { formatDate, formatTimeRemaining } from '../utils/dateFormatter';
import { SafeAreaView } from 'react-native-safe-area-context';

const Bookings = ({ navigation }) => {
  const {
    userBookings,
    loading,
    showProgress,
    setShowProgress,
    handleUnbookMachine
  } = useBookings();

  const {
    lastUses,
    usageHistoryLoading,
    showHistorySection
  } = useUsageHistory();

  // New function to handle unbook button press with confirmation + 30s logic
  // const handleUnbookButtonPress = (machine) => {
  //   const now = Date.now();
  //   const bookedAt = new Date(machine.bookedAt).getTime(); // make sure machine.bookedAt is a valid timestamp
  //   const secondsSinceBooking = (now - bookedAt) / 1000;

  //   if (secondsSinceBooking < 30) {
  //     Alert.alert(
  //       'Unbooking Not Allowed Yet',
  //       'You can only unbook after 30 seconds of booking.',
  //       [{ text: 'OK' }],
  //       { cancelable: true }
  //     );
  //     return;
  //   }

  //   Alert.alert(
  //     'Confirm Unbooking',
  //     `Do you want to unbook Machine No. ${machine.number}?`,
  //     [
  //       {
  //         text: 'No',
  //         style: 'cancel',
  //       },
  //       {
  //         text: 'Yes',
  //         onPress: () => handleUnbookMachine(machine),
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };

  const handleUnbookButtonPress = (machine) => {
    const verifiedAt = machine.verifiedAt?.toDate?.(); // Get JS Date object from Firestore Timestamp
    if (!verifiedAt) {
      Alert.alert(
        'Cannot Unbook',
        'Verification time is missing. Please try again later or contact support.',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      return;
    }
  
    const now = new Date();
    const secondsSinceVerification = Math.floor((now - verifiedAt) / 1000);
  
    if (isNaN(secondsSinceVerification) || secondsSinceVerification < 30) {
      const remaining = Math.ceil(30 - secondsSinceVerification);
      Alert.alert(
        'Unbooking Not Allowed Yet',
        `You can only unbook after ${remaining} more seconds.`,
        [{ text: 'OK' }],
        { cancelable: true }
      );
      return;
    }
  
    // Otherwise show confirmation
    Alert.alert(
      'Confirm Unbooking',
      `Do you want to unbook Machine No. ${machine.number}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => handleUnbookMachine(machine) }
      ],
      { cancelable: true }
    );
  };
  
  
  
  

  if (showProgress) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <LaundryProgress 
          navigation={navigation} 
          closeProgress={() => setShowProgress(false)} 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.container}
        showsVerticalScrollIndicator={true}
      >
        <SectionHeader 
          title="Your Bookings" 
          subtitle={`${userBookings.length} active bookings`} 
        />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3D4EB0" />
          </View>
        ) : (
          <View style={styles.bookingsContainer}>
            {userBookings.length > 0 ? (
              userBookings.map(machine => (
                <BookingCard
                  key={machine.id}
                  machine={machine}
                  formatTimeRemaining={formatTimeRemaining}
                  formatDate={formatDate}
                  onUnbook={handleUnbookButtonPress}
                />
              ))
            ) : (
              <EmptyState message="You don't have any active bookings" />
            )}
          </View>
        )}

        {/* Last Usage History Section */}
        {showHistorySection && (
          <>
            <SectionHeader 
              title="Your Usage History" 
              subtitle={`Last ${lastUses.length} uses`}
              marginTop={30}
            />
            
            {usageHistoryLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#3D4EB0" />
              </View>
            ) : (
              <View style={styles.bookingsContainer}>
                {lastUses.map((useDate, index) => (
                  <HistoryCard 
                    key={index}
                    useDate={useDate}
                    formatDate={formatDate}
                    index={index}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 90,
  },
  loaderContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
  },
  bookingsContainer: {
    marginTop: 10,
  },
});

export default Bookings;