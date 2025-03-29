import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

const EmptyState = ({ message }) => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default EmptyState;