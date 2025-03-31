import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 90, // Extra padding to account for bottom tab navigation
  },
  loaderContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150, // Minimum height to prevent layout jumps
  },
  bookingsContainer: {
    marginTop: 10,
  },
});

export default Bookings;