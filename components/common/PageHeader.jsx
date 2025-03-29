import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PageHeader = ({ title, subtitle, subtitleColor = 'green' }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subheading, { color: subtitleColor }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subheading: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PageHeader;