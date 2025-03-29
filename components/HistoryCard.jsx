import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

const HistoryCard = ({ useDate, formatDate, index }) => {
  const formattedDate = formatDate(useDate);
  
  return (
    <View key={index} style={styles.historyCard}>
      <View style={styles.bookingInfo}>
        <View style={styles.historyIconContainer}>
          <Image
            source={require('../assets/image.png')}
            style={styles.machineIcon}
          />
        </View>
        <View style={styles.bookingDetails}>
          <Text style={styles.washText}>Previous Use</Text>
          <Text style={styles.completedStatus}>Completed</Text>
          {formattedDate && (
            <Text style={styles.bookingDate}>{formattedDate}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  bookingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyIconContainer: {
    backgroundColor: '#F0F0F0',
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
  completedStatus: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '500',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#888',
  },
});

export default HistoryCard;