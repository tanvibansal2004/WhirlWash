import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';

const SectionHeader = ({ title, subtitle, subtitleColor='#3D4EB0', marginTop = 0 }) => {
  return (
    <View style={{ marginTop }}>
      <Text style={styles.heading}>{title}</Text>
      <Text style={[styles.subheading, {color: subtitleColor}]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subheading: {
    fontSize: 16,
    color: '#3D4EB0',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SectionHeader;