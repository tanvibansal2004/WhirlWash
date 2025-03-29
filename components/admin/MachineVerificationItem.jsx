import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MachineVerificationItem = ({ 
  machine, 
  isSelected, 
  onSelect, 
  onCancel 
}) => {
  const timeRemaining = getTimeRemaining(machine.otpVerifyExpiryTime);
  const isExpired = timeRemaining <= 0;

  return (
    <TouchableOpacity
      style={[
        styles.machineItem,
        isSelected && styles.selectedMachine,
        isExpired && styles.expiredMachine
      ]}
      onPress={() => onSelect(machine)}
      disabled={isExpired}
    >
      <View style={styles.machineHeader}>
        <View style={styles.machineNumber}>
          <Text style={styles.machineNumberText}>{machine.number}</Text>
        </View>
        {isExpired ? (
          <Icon name="clock-alert-outline" size={24} color="#E53935" />
        ) : (
          <Icon name="clock-outline" size={24} color="#FF9800" />
        )}
      </View>

      <View style={styles.machineDetails}>
        <Text style={styles.userName}>{machine.userName || 'Unknown User'}</Text>
        <Text style={styles.userEmail}>{machine.bookedBy}</Text>
        {machine.userMobile && (
          <Text style={styles.userMobile}>Mobile: {machine.userMobile}</Text>
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
          onPress={() => onCancel(machine)}
        >
          <Text style={styles.cancelButtonText}>Cancel Reservation</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

// Helper function to calculate time remaining
const getTimeRemaining = (expiryTimeStr) => {
  if (!expiryTimeStr) return 0;
  
  const expiryTime = new Date(expiryTimeStr);
  const now = new Date();
  const diffMs = expiryTime - now;
  
  return Math.max(0, Math.floor(diffMs / 1000)); // Return seconds remaining
};

const styles = StyleSheet.create({
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
});

export default MachineVerificationItem;