import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const MachineCard = ({ machine, onEdit, onDelete }) => {
  const renderMachineStatus = () => {
    if (machine.underMaintenance) {
      return <Text style={styles.maintenanceStatus}>Under Maintenance</Text>;
    } else if (machine.inUse) {
      return <Text style={styles.inUseStatus}>In Use</Text>;
    } else {
      return <Text style={styles.availableStatus}>Available</Text>;
    }
  };

  return (
    <View style={styles.machineCard}>
      <View style={styles.machineHeader}>
        <Text style={styles.machineTitle}>
          Machine No. {machine.number}
        </Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit(machine)}>
            <Icon name="setting" size={24} color="#3D4EB0" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(machine)}>
            <Icon name="delete" size={24} color="#E53935" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.machineDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          {renderMachineStatus()}
        </View>

        {machine.inUse && <ActiveBookingDetails machine={machine} />}
        {!machine.inUse && machine.lastUsedBy && <LastUsageDetails machine={machine} />}
      </View>
    </View>
  );
};

const ActiveBookingDetails = ({ machine }) => (
  <>
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>Booked By:</Text>
      <Text style={styles.detailValue}>
        {machine.bookedBy || 'Unknown'}
      </Text>
    </View>

    {machine.userName && (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>User Name:</Text>
        <Text style={styles.detailValue}>
          {machine.userName}
        </Text>
      </View>
    )}

    {machine.userMobile && (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Mobile:</Text>
        <Text style={styles.detailValue}>
          {machine.userMobile}
        </Text>
      </View>
    )}

    {machine.bookingTime && (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Booked At:</Text>
        <Text style={styles.detailValue}>
          {machine.bookingTime.toDate
            ? machine.bookingTime.toDate().toLocaleString()
            : 'Unknown'}
        </Text>
      </View>
    )}
  </>
);

const LastUsageDetails = ({ machine }) => (
  <>
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>Last Used By:</Text>
      <Text style={styles.detailValue}>
        {machine.lastUsedBy}
      </Text>
    </View>

    {machine.lastUserName && (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>User Name:</Text>
        <Text style={styles.detailValue}>
          {machine.lastUserName}
        </Text>
      </View>
    )}

    {machine.lastUserMobile && (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Mobile:</Text>
        <Text style={styles.detailValue}>
          {machine.lastUserMobile}
        </Text>
      </View>
    )}

    {machine.lastUsedTime && (
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Last Used:</Text>
        <Text style={styles.detailValue}>
          {new Date(machine.lastUsedTime).toLocaleString()}
        </Text>
      </View>
    )}
  </>
);

const styles = StyleSheet.create({
  machineCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  machineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  machineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    marginRight: 15,
  },
  machineDetails: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 100,
  },
  detailValue: {
    flex: 1,
  },
  availableStatus: {
    color: 'green',
    fontWeight: 'bold',
  },
  inUseStatus: {
    color: '#FF9800',
    fontWeight: 'bold',
  },
  maintenanceStatus: {
    color: '#E53935',
    fontWeight: 'bold',
  },
});

export default MachineCard;