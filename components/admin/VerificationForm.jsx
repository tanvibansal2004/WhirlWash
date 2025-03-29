import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const VerificationForm = ({ 
  machine, 
  otpInput, 
  setOtpInput, 
  onVerify, 
  onCancel, 
  verifying 
}) => {
  return (
    <View style={styles.verificationContainer}>
      <Text style={styles.verificationTitle}>
        Verify Machine No. {machine.number}
      </Text>
      
      <View style={styles.userInfoBox}>
        <Text style={styles.userInfoLabel}>User:</Text>
        <Text style={styles.userInfoValue}>{machine.userName || 'Unknown'}</Text>
        
        <Text style={styles.userInfoLabel}>Email:</Text>
        <Text style={styles.userInfoValue}>{machine.bookedBy}</Text>
        
        {machine.userMobile && (
          <>
            <Text style={styles.userInfoLabel}>Mobile:</Text>
            <Text style={styles.userInfoValue}>{machine.userMobile}</Text>
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
          onPress={onCancel}
          disabled={verifying}
        >
          <Text style={styles.cancelVerifyButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.verifyButton, verifying && styles.disabledButton]}
          onPress={onVerify}
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
  );
};

const styles = StyleSheet.create({
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

export default VerificationForm;