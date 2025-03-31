import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

// Custom hooks
import useMachines from '../hooks/useMachines';
import useUserStatus from '../hooks/useUserStatus';
import useElectricityStatus from '../hooks/useElectricityStatus';

// Components
import MachineGrid from '../components/machines/MachineGrid';
import ElectricityShortageAlert from '../components/machines/ElectricityShortageAlert';
import RestrictionAlert from '../components/machines/RestrictionAlert';
import PageHeader from '../components/common/PageHeader';
import LoadingIndicator from '../components/common/LoadingIndicator';

// Services
import machineService from '../services/machineService';
import userService from '../services/userService';

// Utils
import { getTimeRemaining, hasTimeExpired } from '../utils/timeUtils';

const MachinePage = () => {
  const currentUser = auth().currentUser;
  
  // Get machine data using custom hook
  const { 
    availableMachines, 
    bookedMachines,
    pendingOTPMachines,
    maintenanceMachines, 
    loading,
    userHasBooking,
    userHasPendingOTP,
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

  // Check and handle auto-unbooking for machines
  useEffect(() => {
    const checkMachinesExpiry = async () => {
      if (!bookedMachines || bookedMachines.length === 0) return;

      // Check each booked machine
      for (const machine of bookedMachines) {
        if (
          machine.expiryTime && 
          hasTimeExpired(machine.expiryTime) && 
          machine.bookedBy
        ) {
          try {
            console.log(`Auto-unbooking machine ${machine.id} for user ${machine.bookedBy}`);
            await machineService.autoUnbookMachine(machine.id, machine.bookedBy);
            // refreshMachines(); yaad rakhna
          } catch (error) {
            console.error('Error auto-unbooking machine:', error);
          }
        }
      }
    };

    // Check expiry immediately and set up interval
    checkMachinesExpiry();
    const intervalId = setInterval(checkMachinesExpiry, 1000); // Check every 15 seconds

    return () => clearInterval(intervalId);
  }, [bookedMachines, refreshMachines]);

  // Check and handle auto-release for OTP verification
  useEffect(() => {
    const checkOTPExpiry = async () => {
      if (!pendingOTPMachines || pendingOTPMachines.length === 0) return;

      // Check each machine with pending OTP
      for (const machine of pendingOTPMachines) {
        if (
          machine.otpVerifyExpiryTime && 
          hasTimeExpired(machine.otpVerifyExpiryTime) && 
          machine.bookedBy
        ) {
          try {
            console.log(`Auto-releasing machine ${machine.id} for user ${machine.bookedBy} due to OTP expiry`);
            await machineService.autoReleaseIfOTPNotVerified(machine.id, machine.bookedBy);
            // refreshMachines();
          } catch (error) {
            console.error('Error auto-releasing machine:', error);
          }
        }
      }
    };

    // Check OTP expiry immediately and set up interval
    checkOTPExpiry();
    const intervalId = setInterval(checkOTPExpiry, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [pendingOTPMachines, refreshMachines]);

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

      // Check if user already has a booking or pending OTP
      if (userHasBooking || userHasPendingOTP) {
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

      const result = await machineService.bookMachine(machine.id, currentUser.email);
      
      Alert.alert(
        'Machine Reserved', 
        `Machine No. ${machine.number} reserved! Please bring your laundry and verify OTP ${result.otp} with admin. You have 60 seconds.`
      );
      
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
      // refreshMachines(); yaad rakhna
      
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

export default MachinePage;