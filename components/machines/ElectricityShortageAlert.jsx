import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ElectricityShortageAlert = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <View style={styles.electricityShortageContainer}>
      <View style={styles.alertTriangle}>
        <Icon name="warning" size={24} color="#FFA500" />
      </View>
      <View style={styles.electricityShortageTextContainer}>
        <Text style={styles.electricityShortageTitle}>
          Electricity Shortage ⚡
        </Text>
        <Text style={styles.electricityShortageSubtitle}>
          All machine services are temporarily suspended
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  electricityShortageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  alertTriangle: {
    marginRight: 15,
  },
  electricityShortageTextContainer: {
    flex: 1,
  },
  electricityShortageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
  },
  electricityShortageSubtitle: {
    fontSize: 14,
    color: '#856404',
  },
});

export default ElectricityShortageAlert;