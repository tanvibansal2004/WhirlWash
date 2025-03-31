import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Text,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import auth from '@react-native-firebase/auth';

// Components
import MachineVerificationItem from '../../components/admin/MachineVerificationItem';
import VerificationForm from '../../components/admin/VerificationForm';
import EmptyState from '../../components/admin/EmptyState';
import { PageHeader } from '../../components/common';

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

  // Render content based on loading state
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3D4EB0" />
          <Text style={styles.loadingText}>Loading pending verifications...</Text>
        </View>
      );
    }

    if (pendingOTPMachines.length === 0) {
      return <EmptyState message="No pending OTP verifications" />;
    }

    return (
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
        showsVerticalScrollIndicator={true}
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
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={styles.headerContainer}>
        <PageHeader 
          title="Admin OTP Verification" 
          subtitle={`${pendingOTPMachines.length} pending verification(s)`}
        />
      </View>
      <View style={styles.container}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    paddingHorizontal: 15,
    // paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    minHeight: 300,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 120, // Extra padding at the bottom for better scrolling
  },
});

export default AdminUsers;