import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LaundryProgress from './LaundryProgress';
import BookingCard from '../components/BookingCard';
import HistoryCard from '../components/HistoryCard';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';
import useBookings from '../hooks/useBookings';
import useUsageHistory from '../hooks/useUsageHistory';
import { formatDate, formatTimeRemaining } from '../utils/dateFormatter';

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

  // If showing progress view, render the LaundryProgress component
  if (showProgress) {
    return (
      <LaundryProgress 
        navigation={navigation} 
        closeProgress={() => setShowProgress(false)} 
      />
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
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
                onUnbook={handleUnbookMachine}
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
  );
};

// Simplified styles just for the main container
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  loaderContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingsContainer: {
    marginTop: 10,
  },
});

export default Bookings;