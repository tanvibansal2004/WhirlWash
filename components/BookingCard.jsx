import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const BookingCard = ({ machine, formatTimeRemaining, formatDate, onUnbook }) => {
  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingInfo}>
        <View style={styles.machineIconContainer}>
          <Image
            source={require('../assets/image.png')}
            style={styles.machineIcon}
          />
        </View>
        <View style={styles.bookingDetails}>
          <Text style={styles.washText}>Wash</Text>
          <Text style={styles.machineText}>Machine No. {machine.number}</Text>
          <Text style={styles.ongoingStatus}>Ongoing</Text>
          {machine.expiryTime && (
            <Text style={styles.timerText}>
              {machine.timeRemaining > 0 
                ? formatTimeRemaining(machine.timeRemaining) 
                : 'Time expired'}
            </Text>
          )}
          {machine.bookingTime && (
            <Text style={styles.bookingDate}>
              Booked: {formatDate(machine.bookingTime)}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={styles.unbookButton}
        onPress={() => onUnbook(machine)}
      >
        <Text style={styles.unbookButtonText}>Unbook</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  machineIconContainer: {
    backgroundColor: '#EBEEFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
  },
  machineIcon: {
    width: 40,
    height: 40,
  },
  bookingDetails: {
    flex: 1,
  },
  washText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  machineText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  ongoingStatus: {
    fontSize: 16,
    color: '#3D4EB0',
    fontWeight: '500',
    marginBottom: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#888',
  },
  unbookButton: {
    backgroundColor: '#3D4EB0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  unbookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingCard;