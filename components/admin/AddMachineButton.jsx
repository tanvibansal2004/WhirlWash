import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const AddMachineButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.addButton}
      onPress={onPress}>
      <Icon name="pluscircle" size={20} color="white" />
      <Text style={styles.addButtonText}>Add New Machine</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#B03D4E',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default AddMachineButton;