import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const Header = ({ title, subtitle }) => {
  return (
    <>
      <StatusBar backgroundColor="#3D4EB0" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.heading}>{title}</Text>
        <Text style={styles.subheading}>{subtitle}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#3D4EB0',
    padding: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 5,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#90CAF9',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default Header;