import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MachineCard from './MachineCard';

const MachineGrid = ({
  title,
  machines,
  onBook,
  onUnbook,
  getTimeRemaining,
  currentUserEmail,
  isUserRestricted,
  electricityShortage,
}) => {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.grid}>
        {machines.length > 0 ? (
          machines.map((machine) => {
            const isBooked = machine.inUse === true;
            const isUnderMaintenance = machine.underMaintenance === true;
            const isCurrentUserBooking = isBooked && machine.bookedBy === currentUserEmail;
            
            return (
              <MachineCard
                key={machine.id}
                machine={machine}
                booked={isBooked}
                maintenance={isUnderMaintenance}
                getTimeRemaining={getTimeRemaining}
                isCurrentUserBooking={isCurrentUserBooking}
                disabled={isUserRestricted}
                electricityShortage={electricityShortage}
                onPress={() => !isBooked && !isUnderMaintenance && onBook(machine)}
                onUnbook={() => isCurrentUserBooking && onUnbook(machine)}
              />
            );
          })
        ) : (
          <Text style={styles.noMachinesText}>No {title.toLowerCase()}</Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noMachinesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 10,
    width: '100%',
  },
});

export default MachineGrid;