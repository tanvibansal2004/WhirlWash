import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';

// Custom hooks
import useMachines from '../hooks/useMachines';
import useUserStatus from '../hooks/useUserStatus';
import useElectricityStatus from '../hooks/useElectricityStatus';

// Components
import MachineGrid from '../components/machines/MachineGrid';
import ElectricityShortageAlert from '../components/machines/ElectricityShortageAlert';
import RestrictionAlert from '../components/machines/RestrictionAlert';
import LoadingIndicator from '../components/common/LoadingIndicator';

// Services
import machineService from '../services/machineService';
import userService from '../services/userService';

// Utils
import {getTimeRemaining, hasTimeExpired} from '../utils/timeUtils';
import SectionHeader from '../components/SectionHeader';

// Keep track of which machines we're handling in expiry checks
const checkingMachines = {};

const MachinePage = () => {
  const currentUser = auth().currentUser;

  // Local loading state to override the hook's loading state
  const [isLoading, setIsLoading] = useState(false);

  // Get machine data using custom hook
  const {
    availableMachines,
    bookedMachines,
    pendingOTPMachines,
    maintenanceMachines,
    loading: hookLoading,
    userHasBooking,
    userHasPendingOTP,
    refreshMachines,
  } = useMachines();

  // Get user status using custom hook
  const {userCooldownUntil, penaltyUntil, restrictionSeconds, restrictionType} =
    useUserStatus(currentUser?.email);

  // Get electricity status using custom hook
  const {electricityShortage, electricityShortageStartTime} =
    useElectricityStatus();

  // Custom refresh function with timeout
  const safeRefreshMachines = () => {
    // Set our local loading state
    setIsLoading(true);

    // Call the hook's refresh function
    refreshMachines();

    // Reset loading after 2 seconds, regardless of what happens
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Check and handle auto-unbooking for machines
  useEffect(() => {
    const checkMachinesExpiry = async () => {
      if (!bookedMachines || bookedMachines.length === 0) return;

      // Check each booked machine
      for (const machine of bookedMachines) {
        if (
          machine.expiryTime &&
          hasTimeExpired(machine.expiryTime) &&
          machine.bookedBy &&
          !checkingMachines[machine.id] // Prevent multiple simultaneous checks
        ) {
          try {
            // Mark as being checked
            checkingMachines[machine.id] = true;

            console.log(`Checking expiry for machine ${machine.id}`);
            const result = await machineService.autoUnbookMachine(
              machine.id,
              machine.bookedBy,
            );

            // Only refresh if an actual change was made
            if (result === true) {
              safeRefreshMachines();
            }

            // Remove from checking after a delay
            setTimeout(() => {
              delete checkingMachines[machine.id];
            }, 3000);
          } catch (error) {
            console.error('Error in expiry check:', error);
            delete checkingMachines[machine.id];
          }
        }
      }
    };

    // Run the check once on mount
    checkMachinesExpiry();

    // Set up interval with proper cleanup
    const intervalId = setInterval(checkMachinesExpiry, 1000); // Check every 10 seconds
    return () => {
      clearInterval(intervalId);
      // Clear all checking flags on unmount
      for (const key in checkingMachines) {
        delete checkingMachines[key];
      }
    };
  }, [bookedMachines]);

  // Check and handle auto-release for OTP verification
  useEffect(() => {
    const checkOTPExpiry = async () => {
      if (!pendingOTPMachines || pendingOTPMachines.length === 0) return;

      // Check each machine with pending OTP
      for (const machine of pendingOTPMachines) {
        if (
          machine.otpVerifyExpiryTime &&
          hasTimeExpired(machine.otpVerifyExpiryTime) &&
          machine.bookedBy &&
          !checkingMachines[machine.id] // Prevent multiple simultaneous checks
        ) {
          try {
            // Mark as being checked
            checkingMachines[machine.id] = true;

            console.log(`Checking OTP expiry for machine ${machine.id}`);
            const result = await machineService.autoReleaseIfOTPNotVerified(
              machine.id,
              machine.bookedBy,
            );

            // Only refresh if an actual change was made
            if (result === true) {
              safeRefreshMachines();
            }

            // Remove from checking after a delay
            setTimeout(() => {
              delete checkingMachines[machine.id];
            }, 3000);
          } catch (error) {
            console.error('Error in OTP expiry check:', error);
            delete checkingMachines[machine.id];
          }
        }
      }
    };

    // Run the check once
    checkOTPExpiry();

    // Set up interval with proper cleanup
    const intervalId = setInterval(checkOTPExpiry, 10000); // Check every 10 seconds
    return () => {
      clearInterval(intervalId);
      // Clear all checking flags on unmount
      for (const key in checkingMachines) {
        delete checkingMachines[key];
      }
    };
  }, [pendingOTPMachines]);

  // Force a refresh on component mount
  useEffect(() => {
    // Initial refresh when component mounts
    safeRefreshMachines();
  }, []);

  const handleBookMachine = async machine => {
    if (electricityShortage) {
      Alert.alert(
        'Service Unavailable',
        'Machine booking is paused due to electricity shortage.',
      );
      return;
    }

    try {
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to book a machine.');
        return;
      }

      if (machine.inUse) return;

      // Check if user already has a booking or pending OTP
      if (userHasBooking || userHasPendingOTP) {
        Alert.alert('Error', 'You can only book one machine at a time.');
        return;
      }

      if (restrictionType === 'cooldown' && restrictionSeconds > 0) {
        Alert.alert(
          'Booking not allowed',
          `You need to wait ${restrictionSeconds} seconds before booking another machine.`,
        );
        return;
      }

      if (restrictionType === 'penalty' && restrictionSeconds > 0) {
        Alert.alert(
          'Booking restricted',
          `You have been penalized for not unbooking a machine. Please wait ${restrictionSeconds} seconds.`,
        );
        return;
      }

      const result = await machineService.bookMachine(
        machine.id,
        currentUser.email,
      );

      Alert.alert(
        'Machine Reserved',
        `Machine No. ${machine.number} reserved! Please bring your laundry and verify OTP ${result.otp} with admin. You have 60 seconds.`,
      );

      safeRefreshMachines();
    } catch (error) {
      console.error('Error booking machine:', error);
      Alert.alert('Error', 'Failed to book machine.');
    }
  };

  const handleUnbookMachine = async machine => {
    if (electricityShortage) {
      Alert.alert(
        'Service Unavailable',
        'Machine unbooking is paused due to electricity shortage.',
      );
      return;
    }

    try {
      if (!currentUser) {
        Alert.alert('Error', 'You must be logged in to unbook a machine.');
        return;
      }

      if (machine.bookedBy !== currentUser.email) {
        Alert.alert(
          'Error',
          'You can only unbook machines that you have booked.',
        );
        return;
      }

      const result = await machineService.unbookMachine(
        machine.id,
        currentUser.email,
      );

      Alert.alert(
        'Machine Unbooked',
        'You have successfully unbooked the machine. You can book another machine after 30 seconds.',
      );

      // Only refresh if actual change was made
      if (result === true) {
        safeRefreshMachines();
      }
    } catch (error) {
      console.error('Error unbooking machine:', error);
      Alert.alert('Error', 'Failed to unbook machine.');
    }
  };

  const isUserRestricted = restrictionType !== null && restrictionSeconds > 0;

  // Determine if we should show loading based on local state or hook state
  const showLoading = isLoading || (hookLoading && !isLoading);

  // This is the actual render part
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}>

        <SectionHeader
          title="LNMIIT Jaipur"
          subtitle={`${availableMachines.length} available machines`}
          subtitleColor="green"
        />

        <ElectricityShortageAlert isActive={electricityShortage} />
        <RestrictionAlert type={restrictionType} seconds={restrictionSeconds} />

        {showLoading ? (
          <LoadingIndicator />
        ) : (
          <View style={styles.machinesContainer}>
            <MachineGrid
              title="Available washing machines"
              machines={availableMachines}
              onBook={handleBookMachine}
              currentUserEmail={currentUser?.email}
              isUserRestricted={isUserRestricted}
              electricityShortage={electricityShortage}
              getTimeRemaining={getTimeRemaining}
            />

            {pendingOTPMachines.length > 0 && (
              <MachineGrid
                title="Pending OTP Verification"
                machines={pendingOTPMachines}
                currentUserEmail={currentUser?.email}
                isUserRestricted={isUserRestricted}
                electricityShortage={electricityShortage}
                getTimeRemaining={getTimeRemaining}
                isPendingOTP={true}
              />
            )}

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
          </View>
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
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 70, // Add extra padding at bottom for better scrolling experience
  },
  machinesContainer: {
    flex: 1,
  },
});

export default MachinePage;
