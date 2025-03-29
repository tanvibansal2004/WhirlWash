import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RestrictionAlert = ({ type, seconds }) => {
  if (!type || seconds <= 0) return null;

  const message = type === 'penalty'
    ? `Penalty: Wait ${seconds}s before booking`
    : `Next Slot: Wait ${seconds}s before booking`;

  return (
    <View style={styles.restrictionContainer}>
      <Text style={styles.restrictionText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  restrictionContainer: {
    backgroundColor: '#FFECB3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  restrictionText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#E65100',
  },
});

export default RestrictionAlert;