// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const AdminUsers = () => {
//   return (
//     <View>
//       <Text>AdminUsers</Text>
//     </View>
//   )
// }

// export default AdminUsers

// const styles = StyleSheet.create({})

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminUsers = ({ navigation }) => {
  const [pendingOTPMachines, setPendingOTPMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const currentUser = auth().currentUser;

  useEffect(() => {
    // Check if user is an admin
    // const checkAdminStatus = async () => {
    //   try {
    //     const userDoc = await firestore()
    //       .collection('admins')
    //       .doc(currentUser?.uid)
    //       .get();

    //     if (!userDoc.exists) {
    //       Alert.alert(
    //         'Access Denied',
    //         'You do not have admin privileges to access this page.',
    //         [{ text: 'OK', onPress: () => navigation.goBack() }]
    //       );
    //     }
        

    //   } catch (error) {
    //     console.error('Error checking admin status:', error);
    //     Alert.alert('Error', 'Failed to verify admin privileges.');
    //     navigation.goBack();
    //   }
    // };

    if (!currentUser) {
      
      Alert.alert('Error', 'You must be logged in to access this page.');
      navigation.goBack();
    }

    // Set up real-time listener for pending OTP machines
    const unsubscribe = firestore()
      .collection('machines')
      .where('pendingOTPVerification', '==', true)
      .onSnapshot(
        snapshot => {
          const pendingOTP = [];

          snapshot.forEach(doc => {
            const data = doc.data();
            pendingOTP.push({ id: doc.id, ...data });
          });

          // Sort machines by number
          pendingOTP.sort((a, b) => (a.number || 0) - (b.number || 0));
          setPendingOTPMachines(pendingOTP);
          setLoading(false);
        },
        error => {
          console.error('Error listening to pending OTP machines:', error);
          Alert.alert('Error', 'Failed to load pending OTP machines.');
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [currentUser, navigation]);

  const verifyOTP = async () => {
    if (!selectedMachine) {
      Alert.alert('Error', 'Please select a machine first.');
      return;
    }

    if (!otpInput) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    try {
      setVerifying(true);
      
      // Direct verification against stored OTP - much faster approach
      const machineRef = firestore().collection('machines').doc(selectedMachine.id);
      const machineDoc = await machineRef.get();
      
      if (!machineDoc.exists) {
        Alert.alert('Error', 'Machine data not found.');
        setVerifying(false);
        return;
      }
      
      const machineData = machineDoc.data();
      const currentTime = new Date();
      const expiryTime = machineData.otpVerifyExpiryTime ? new Date(machineData.otpVerifyExpiryTime) : null;
      const isExpired = expiryTime && currentTime > expiryTime;
      
      // Verify OTP directly
      if (isExpired) {
        Alert.alert('Error', 'OTP has expired. Please ask the user to book again.');
        setVerifying(false);
        return;
      }
      
      if (machineData.otp === otpInput) {
        // OTP is correct - update machine status
        const newExpiryTime = new Date();
        newExpiryTime.setSeconds(newExpiryTime.getSeconds() + 60);

        await machineRef.update({
          pendingOTPVerification: false,
          inUse: true,
          status: 'in-use',
          otpVerifiedTime: currentTime.toISOString(),
          otpVerifyExpiryTime: null,
          expiryTime: newExpiryTime.toISOString(),
          verifiedBy: currentUser.email,
          verifiedAt: firestore.FieldValue.serverTimestamp(),
        });
        
        // Also log the verification for audit purposes (optional)
        await firestore().collection('machineVerifications').add({
          machineId: selectedMachine.id,
          machineNumber: selectedMachine.number,
          adminId: currentUser.uid,
          adminEmail: currentUser.email,
          userName: machineData.userName,
          userEmail: machineData.bookedBy,
          userMobile: machineData.userMobile,
          verifiedAt: firestore.FieldValue.serverTimestamp(),
        });
        
        Alert.alert(
          'Success',
          `Machine No. ${selectedMachine.number} has been verified and is now in use by ${selectedMachine.userName}.`,
          [{ text: 'OK', onPress: () => {
            setSelectedMachine(null);
            setOtpInput('');
            setVerifying(false);
          }}]
        );
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
        setVerifying(false);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
      setVerifying(false);
    }
  };

  const cancelOTPVerification = async (machine) => {
    try {
      await firestore().collection('machines').doc(machine.id).update({
        pendingOTPVerification: false,
        bookedBy: null,
        status: 'available',
        otpVerifyExpiryTime: null,
        userName: '',
        userMobile: '',
        otp: null,
      });

      Alert.alert('Success', `Reservation for Machine No. ${machine.number} has been cancelled.`);
      setSelectedMachine(null);
      setOtpInput('');
    } catch (error) {
      console.error('Error cancelling OTP verification:', error);
      Alert.alert('Error', 'Failed to cancel reservation.');
    }
  };

  // Get time remaining for OTP verification
  const getTimeRemaining = (expiryTimeStr) => {
    if (!expiryTimeStr) return 0;
    
    const expiryTime = new Date(expiryTimeStr);
    const now = new Date();
    const diffMs = expiryTime - now;
    
    return Math.max(0, Math.floor(diffMs / 1000)); // Return seconds remaining
  };

  const renderMachineItem = ({ item }) => {
    const timeRemaining = getTimeRemaining(item.otpVerifyExpiryTime);
    const isExpired = timeRemaining <= 0;
    const isSelected = selectedMachine && selectedMachine.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.machineItem,
          isSelected && styles.selectedMachine,
          isExpired && styles.expiredMachine
        ]}
        onPress={() => {
          setSelectedMachine(item);
          setOtpInput(''); // Clear OTP input when selecting a new machine
        }}
        disabled={isExpired}
      >
        <View style={styles.machineHeader}>
          <View style={styles.machineNumber}>
            <Text style={styles.machineNumberText}>{item.number}</Text>
          </View>
          {isExpired ? (
            <Icon name="clock-alert-outline" size={24} color="#E53935" />
          ) : (
            <Icon name="clock-outline" size={24} color="#FF9800" />
          )}
        </View>

        <View style={styles.machineDetails}>
          <Text style={styles.userName}>{item.userName || 'Unknown User'}</Text>
          <Text style={styles.userEmail}>{item.bookedBy}</Text>
          {item.userMobile && (
            <Text style={styles.userMobile}>Mobile: {item.userMobile}</Text>
          )}
          
          <View style={styles.timeContainer}>
            <Icon name="timer-outline" size={16} color={isExpired ? '#E53935' : '#FF9800'} />
            <Text style={[styles.timeText, isExpired && styles.expiredText]}>
              {isExpired ? 'Expired' : `${timeRemaining}s remaining`}
            </Text>
          </View>
        </View>

        {isSelected && !isExpired && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => cancelOTPVerification(item)}
          >
            <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#3D4EB0" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.heading}>Admin OTP Verification</Text>
        <Text style={styles.subheading}>
          {pendingOTPMachines.length} pending verification(s)
        </Text>
      </View>

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
              renderItem={renderMachineItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              ListFooterComponent={
                selectedMachine && (
                  <View style={styles.verificationContainer}>
                    <Text style={styles.verificationTitle}>
                      Verify Machine No. {selectedMachine.number}
                    </Text>
                    
                    <View style={styles.userInfoBox}>
                      <Text style={styles.userInfoLabel}>User:</Text>
                      <Text style={styles.userInfoValue}>{selectedMachine.userName || 'Unknown'}</Text>
                      
                      <Text style={styles.userInfoLabel}>Email:</Text>
                      <Text style={styles.userInfoValue}>{selectedMachine.bookedBy}</Text>
                      
                      {selectedMachine.userMobile && (
                        <>
                          <Text style={styles.userInfoLabel}>Mobile:</Text>
                          <Text style={styles.userInfoValue}>{selectedMachine.userMobile}</Text>
                        </>
                      )}
                    </View>
                    
                    <Text style={styles.otpInstructionText}>
                      Ask user to show their OTP and enter it below to verify:
                    </Text>
                    
                    <TextInput
                      style={styles.otpInput}
                      placeholder="Enter OTP shown by user"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={6}
                      value={otpInput}
                      onChangeText={setOtpInput}
                    />
                    
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelVerifyButton]}
                        onPress={() => {
                          setSelectedMachine(null);
                          setOtpInput('');
                        }}
                        disabled={verifying}
                      >
                        <Text style={styles.cancelVerifyButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.button, styles.verifyButton, verifying && styles.disabledButton]}
                        onPress={verifyOTP}
                        disabled={verifying}
                      >
                        {verifying ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <>
                            <Icon name="check-circle" size={18} color="white" style={styles.buttonIcon} />
                            <Text style={styles.verifyButtonText}>Verify & Start Machine</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="check-circle" size={48} color="#4CAF50" />
              <Text style={styles.emptyText}>No pending OTP verifications</Text>
            </View>
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
  header: {
    backgroundColor: '#3D4EB0',
    padding: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 5,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#90CAF9',
    textAlign: 'center',
    marginTop: 5,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FB',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  machineItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    elevation: 2,
  },
  selectedMachine: {
    borderWidth: 2,
    borderColor: '#3D4EB0',
  },
  expiredMachine: {
    opacity: 0.7,
  },
  machineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  machineNumber: {
    backgroundColor: '#3D4EB0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  machineNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  machineDetails: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userMobile: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  expiredText: {
    color: '#E53935',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#E53935',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verificationContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    marginTop: 10,
    marginBottom: 20,
  },
  verificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  userInfoBox: {
    backgroundColor: '#F0F4FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  userInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  userInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  otpInstructionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  otpInput: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1,
    borderColor: '#3D4EB0',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 5,
    marginBottom: 20,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelVerifyButton: {
    backgroundColor: '#E0E0E0',
    width: '30%',
  },
  cancelVerifyButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    width: '65%',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default AdminUsers;