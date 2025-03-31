import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';

// Components
import MachineLogCard from '../../components/admin/MachineLogCard';
import FilterControls from '../../components/admin/FilterControls';
import PageHeader from '../../components/admin/PageHeader';
import AccessRestricted from '../../components/admin/AccessRestricted';

// Hooks
import useAdminPermission from '../../hooks/useAdminPermission';
import useMachineLogsData from '../../hooks/useMachineLogsData';
import useLogFiltering from '../../hooks/useLogFiltering';

const AdminLogsPage = () => {
  // Check if the user has admin permission
  const { isAdmin, loading: permissionLoading } = useAdminPermission();
  
  // Fetch machines and logs data
  const { machines, usageLogs, loading: dataLoading } = useMachineLogsData(isAdmin);
  
  // Filter logs based on user input
  const {
    selectedMachine,
    setSelectedMachine,
    searchQuery,
    setSearchQuery,
    filteredLogs
  } = useLogFiltering(usageLogs);

  // Handle view more action
  const handleViewMore = (machineNumber, logs) => {
    // Implementation for viewing more logs for a specific machine
    console.log(`View more logs for machine ${machineNumber}`);
  };

  // Render machine log cards
  const renderContent = () => {
    // Create a map of machine logs
    const machineLogsMap = {};
    filteredLogs.forEach(log => {
      if (!machineLogsMap[log.machineNumber]) {
        machineLogsMap[log.machineNumber] = [];
      }
      machineLogsMap[log.machineNumber].push(log);
    });

    // Render cards for all machines
    const machineLogCards = machines
      .map(machine => (
        <MachineLogCard
          key={machine.id}
          machineNumber={machine.number}
          logs={machineLogsMap[machine.number] || []}
          onViewMore={handleViewMore}
        />
      ))
      .filter(card => card != null); // Remove any null cards

    return (
      <View style={styles.logsContainer}>
        {machineLogCards.length > 0 ? (
          machineLogCards
        ) : (
          <Text style={styles.noLogsText}>No usage logs available</Text>
        )}
      </View>
    );
  };

  // Loading state
  const loading = permissionLoading || (isAdmin && dataLoading);

  // Render access restricted view if not admin
  if (!permissionLoading && !isAdmin) {
    return (
      <SafeAreaView style={styles.container}>
        <AccessRestricted />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled">
        
        <PageHeader 
          title="LNMIIT Admin Panel" 
          subtitle="WhirlWash - Machine Usage Logs" 
        />

        <FilterControls
          machines={machines}
          selectedMachine={selectedMachine}
          setSelectedMachine={setSelectedMachine}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3D4EB0" />
          </View>
        ) : (
          renderContent()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 140, // Ensure content can scroll beyond bottom tabs
  },
  logsContainer: {
    flex: 1,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  noLogsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
});

export default AdminLogsPage;