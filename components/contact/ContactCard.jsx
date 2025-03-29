import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactCard = ({ title, name, phone, email }) => (
  <View style={styles.contactCard}>
    {title && <Text style={styles.cardTitle}>{title}</Text>}
    <Text style={styles.cardName}>{name}</Text>
    <Text style={styles.cardDetail}>{phone}</Text>
    <Text style={styles.cardDetail}>{email}</Text>
  </View>
);

const styles = StyleSheet.create({
  contactCard: {
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 18,
    color: '#444',
    marginBottom: 6,
  },
  cardDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
});

export default ContactCard;