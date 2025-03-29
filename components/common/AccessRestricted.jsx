import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AccessRestricted = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Access Restricted</Text>
      <Text style={styles.subheading}>Admin permissions required</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
  },
});

export default AccessRestricted;