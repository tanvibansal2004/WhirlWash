import { useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';

const useOTPVerification = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const currentUser = auth().currentUser;

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
      
      // Direct verification against stored OTP
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
        
        // Also log the verification for audit purposes
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

  const resetVerificationForm = () => {
    setSelectedMachine(null);
    setOtpInput('');
  };

  return {
    selectedMachine,
    setSelectedMachine,
    otpInput,
    setOtpInput,
    verifying,
    verifyOTP,
    cancelOTPVerification,
    resetVerificationForm
  };
};

export default useOTPVerification;