import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const DeveloperCard = ({ name, email, image }) => (
  <View style={styles.developerCard}>
    <Image source={image} style={styles.developerImage} />
    <View style={styles.developerInfo}>
      <Text style={styles.developerName}>{name}</Text>
      <Text style={styles.developerEmail}>{email}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  developerCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  developerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  developerEmail: {
    color: 'black',
    fontSize: 14,
  },
});

export default DeveloperCard;