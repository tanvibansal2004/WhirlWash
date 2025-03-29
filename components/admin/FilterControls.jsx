import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/AntDesign';

const FilterControls = ({ 
  machines, 
  selectedMachine, 
  setSelectedMachine, 
  searchQuery, 
  setSearchQuery 
}) => {
  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filterItem}>
        <Text style={styles.filterLabel}>Machine:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMachine}
            style={styles.picker}
            onValueChange={itemValue => setSelectedMachine(itemValue)}>
            <Picker.Item label="All Machines" value="all" />
            {machines.map(machine => (
              <Picker.Item
                key={machine.id}
                label={`Machine ${machine.number}`}
                value={machine.number.toString()}
              />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, roll no, or mobile"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  filterItem: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
  },
  clearButton: {
    padding: 5,
  },
});

export default FilterControls;