import React from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';

const ElectricityShortageControl = ({ isActive, onToggle }) => {
  return (
    <View style={styles.electricityShortageContainer}>
      <Text style={styles.electricityShortageLabel}>Electricity Shortage</Text>
      <Switch
        value={isActive}
        onValueChange={(value) => {
          if (value) {
            Alert.alert(
              'Electricity Shortage',
              'All machine activities will be paused. Are you sure?',
              [
                {
                  text: 'Cancel',
                  onPress: () => onToggle(false),
                  style: 'cancel'
                },
                {
                  text: 'Confirm',
                  onPress: () => onToggle(value)
                }
              ]
            );
          } else {
            onToggle(value);
          }
        }}
        trackColor={{false: '#767577', true: '#E53935'}}
        thumbColor={isActive ? '#f4f3f4' : '#f4f3f4'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  electricityShortageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 10,
  },
  electricityShortageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ElectricityShortageControl;