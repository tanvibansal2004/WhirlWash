import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useTimer from '../../hooks/useTimer';

const MachineCard = ({
  machine,
  onPress,
  onUnbook,
  booked,
  maintenance,
  getTimeRemaining,
  isCurrentUserBooking,
  disabled,
  electricityShortage,
}) => {
  const timeRemaining = useTimer(
    booked && machine.expiryTime ? getTimeRemaining(machine.expiryTime, machine.isPaused ? machine.pausedTime || 0 : 0) : 0,
    booked && machine.expiryTime
  );

  return (
    <TouchableOpacity
      style={[
        styles.machineCard,
        booked && styles.bookedMachine,
        maintenance && styles.maintenanceMachine,
        disabled && !booked && !maintenance && styles.disabledMachine,
        electricityShortage && styles.electricityShortageCard,
      ]}
      onPress={onPress}
      disabled={booked || maintenance || disabled || electricityShortage}
    >
      <Image
        source={require('../../assets/image.png')}
        style={[
          styles.machineIcon,
          electricityShortage && styles.grayScaleImage,
        ]}
      />

      <Text style={styles.machineText}>No. {machine.number}</Text>

      {electricityShortage && (
        <View style={styles.noPowerContainer}>
          <View style={styles.noPowerInlineContent}>
            <Icon name="warning" size={20} color="#FFA500" />
            <Text style={styles.noPowerText}>NO POWER</Text>
          </View>
        </View>
      )}

      {!electricityShortage && (
        <>
          {booked && (
            <View style={styles.bookedInfo}>
              {machine.expiryTime && (
                <Text style={styles.timerText}>
                  {timeRemaining > 0
                    ? `${timeRemaining}s remaining`
                    : 'Time expired'}
                </Text>
              )}
              <Text style={styles.bookedByText}>In use</Text>

              {isCurrentUserBooking && (
                <TouchableOpacity
                  style={styles.unbookButton}
                  onPress={onUnbook}>
                  <Text style={styles.unbookButtonText}>Unbook</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {maintenance && (
            <View style={styles.maintenanceInfo}>
              <Text style={styles.maintenanceText}>Under Maintenance</Text>
            </View>
          )}

          {!booked && !maintenance && machine.autoUnbooked === true && (
            <View style={styles.lastUserInfo}>
              <Text style={styles.lastUserText}>Last used by:</Text>
              <Text style={styles.lastUserName}>{machine.lastUserName}</Text>
              <Text style={styles.lastUserMobile}>
                {machine.lastUserMobile}
              </Text>
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  machineCard: {
    width: '45%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  bookedMachine: {
    backgroundColor: '#f0f0f0',
  },
  maintenanceMachine: {
    backgroundColor: '#FCFAE8',
  },
  disabledMachine: {
    opacity: 0.7,
  },
  machineIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  machineText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookedInfo: {
    marginTop: 5,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 5,
  },
  bookedByText: {
    fontSize: 12,
    color: '#555',
  },
  maintenanceInfo: {
    marginTop: 5,
    alignItems: 'center',
  },
  maintenanceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53935',
  },
  lastUserInfo: {
    marginTop: 5,
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    width: '100%',
  },
  lastUserText: {
    fontSize: 12,
    color: '#555',
  },
  lastUserName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  lastUserMobile: {
    fontSize: 12,
    color: '#666',
  },
  unbookButton: {
    marginTop: 8,
    backgroundColor: '#3D4EB0',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  unbookButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  electricityShortageCard: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    opacity: 0.6,
  },
  grayScaleImage: {
    tintColor: 'grayscale(100%)',
    opacity: 0.5,
  },
  noPowerContainer: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
  },
  noPowerInlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  noPowerText: {
    color: '#FFA500',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
});

export default MachineCard;