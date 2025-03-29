import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Text
} from 'react-native';
import auth from '@react-native-firebase/auth';

// Components
import MachineVerificationItem from '../../components/admin/MachineVerificationItem';
import VerificationForm from '../../components/admin/VerificationForm';
import EmptyState from '../../components/admin/EmptyState';
import Header from '../../components/admin/Header';

// Hooks
import useOTPVerification from '../../hooks/useOTPVerification';
import usePendingOTPMachines from '../../hooks/usePendingOTPMachines';

const AdminUsers = ({ navigation }) => {
  // Get current user
  const currentUser = auth().currentUser;

  // Check if user is logged in
  if (!currentUser) {
    Alert.alert('Error', 'You must be logged in to access this page.');
    navigation.goBack();
    return null;
  }

  // Get pending OTP machines
  const { pendingOTPMachines, loading } = usePendingOTPMachines();

  // OTP verification functionality
  const {
    selectedMachine,
    setSelectedMachine,
    otpInput,
    setOtpInput,
    verifying,
    verifyOTP,
    cancelOTPVerification,
    resetVerificationForm
  } = useOTPVerification();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Admin OTP Verification" 
        subtitle={`${pendingOTPMachines.length} pending verification(s)`}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3D4EB0" />
          <Text style={styles.loadingText}>Loading pending verifications...</Text>
        </View>
      ) : (
        <View style={styles.container}>
          {pendingOTPMachines.length > 0 ? (
            <FlatList
              data={pendingOTPMachines}
              renderItem={({ item }) => (
                <MachineVerificationItem
                  machine={item}
                  isSelected={selectedMachine && selectedMachine.id === item.id}
                  onSelect={(machine) => {
                    setSelectedMachine(machine);
                    setOtpInput(''); // Clear OTP input when selecting a new machine
                  }}
                  onCancel={cancelOTPVerification}
                />
              )}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              ListFooterComponent={
                selectedMachine && (
                  <VerificationForm
                    machine={selectedMachine}
                    otpInput={otpInput}
                    setOtpInput={setOtpInput}
                    onVerify={verifyOTP}
                    onCancel={resetVerificationForm}
                    verifying={verifying}
                  />
                )
              }
            />
          ) : (
            <EmptyState message="No pending OTP verifications" />
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3D4EB0',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
});

export default AdminUsers;