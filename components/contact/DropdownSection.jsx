import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DropdownSection = ({ title, isExpanded, onPress, children }) => (
  <View style={styles.dropdownContainer}>
    <TouchableOpacity 
      style={styles.dropdownHeader} 
      onPress={onPress}
    >
      <Text style={styles.dropdownTitle}>{title}</Text>
      <Icon 
        name={isExpanded ? "chevron-down" : "chevron-forward"} 
        size={24} 
        color="#000"
      />
    </TouchableOpacity>
    {isExpanded && children}
  </View>
);

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});

export default DropdownSection;