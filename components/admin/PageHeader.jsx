import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const PageHeader = ({ title, subtitle }) => {
  return (
    <View>
      <Text style={styles.heading}>{title}</Text>
      <Text style={styles.subheading}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subheading: {
    fontSize: 16,
    color: '#B03D4E',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default PageHeader;