import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { formatTimestamp } from '../../utils/dateFormatter';

const MachineLogCard = ({ machineNumber, logs, onViewMore }) => {
  // Only use actual logs with valid data
  const displayLogs = logs
    .filter(log => log.userName || log.userEmail || log.userMobile)
    .slice(0, 3);

  return (
    <View style={styles.machineLogCard}>
      <View style={styles.machineHeader}>
        <View style={styles.machineHeaderContent}>
          <MaterialIcon
            name="local-laundry-service"
            size={24}
            color="#3D4EB0"
          />
          <Text style={styles.machineTitle}>Machine No. {machineNumber}</Text>
        </View>
        <Text style={styles.machineSubtitle}>
          {displayLogs.length} recent uses
        </Text>
      </View>

      {displayLogs.length === 0 ? (
        <View style={styles.noUsageContainer}>
          <Text style={styles.noUsageText}>
            Nobody has used this machine yet
          </Text>
        </View>
      ) : (
        displayLogs.map((log, index) => (
          <LogEntryItem 
            key={log.id || `log-${index}`}
            log={log}
            isLast={index === displayLogs.length - 1}
          />
        ))
      )}

      {logs.length > 3 && (
        <TouchableOpacity 
          style={styles.viewMoreButton}
          onPress={() => onViewMore(machineNumber, logs)}
        >
          <Text style={styles.viewMoreText}>View More Uses</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const LogEntryItem = ({ log, isLast }) => (
  <View
    style={[
      styles.logEntry,
      !isLast && styles.logEntrySeparator,
    ]}>
    <View style={styles.logEntryDetails}>
      <Text style={styles.logStudentName}>
        {log.userName || 'Unknown Student'}
      </Text>
      <Text style={styles.logTimestamp}>
        {formatTimestamp(log.timestamp)}
      </Text>
    </View>
    <View style={styles.logEntryContact}>
      <Text style={styles.logContactDetail}>
        {log.userEmail || 'N/A'}
      </Text>
      <Text style={styles.logContactDetail}>
        {log.userMobile || 'N/A'}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  machineLogCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  machineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  machineHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  machineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#3D4EB0',
  },
  machineSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  logEntry: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  logEntrySeparator: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logEntryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  logStudentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  logTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  logEntryContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logContactDetail: {
    fontSize: 13,
    color: '#888',
  },
  viewMoreButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  viewMoreText: {
    color: '#3D4EB0',
    fontWeight: '600',
  },
  noUsageContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noUsageText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default MachineLogCard;