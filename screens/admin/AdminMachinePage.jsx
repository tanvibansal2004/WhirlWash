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
import MachineCard from '../../components/admin/MachineCard';
// import ElectricityShortageControl from '../../components/admin/ElectricityShortageControl';
import AddMachineButton from '../../components/admin/AddMachineButton';
import AddMachineModal from '../../components/admin/AddMachineModal';
import EditMachineModal from '../../components/admin/EditMachineModal';
import PageHeader from '../../components/common/PageHeader';
import AccessRestricted from '../../components/common/AccessRestricted';

// Hooks
import useAdminPermission from '../../hooks/useAdminPermission';
import useElectricityShortage from '../../hooks/useElectricityShortage';
import useMachineManagement from '../../hooks/useMachineManagement';

const AdminMachinePage = () => {
  // Check admin permission
  const { isAdmin, loading: adminLoading } = useAdminPermission();
  
  // Electricity shortage state
  const { electricityShortage, updateElectricityShortage } = useElectricityShortage(isAdmin);
  
  // Machine management
  const {
    machines,
    loading: machinesLoading,
    modalVisible,
    setModalVisible,
    editModalVisible,
    setEditModalVisible,
    currentMachine,
    newMachineNumber,
    setNewMachineNumber,
    underMaintenance,
    setUnderMaintenance,
    handleAddMachine,
    handleDeleteMachine,
    handleEditMachine,
    handleUpdateMachine,
    resetAddMachineForm
  } = useMachineManagement(isAdmin);

  const loading = adminLoading || machinesLoading;

  // If not admin, show restricted access
  if (!isAdmin && !adminLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <AccessRestricted />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled">
        
        <PageHeader title="LNMIIT Admin Panel" subtitle="WhirlWash" />

        {/* <ElectricityShortageControl 
          isActive={electricityShortage} 
          onToggle={updateElectricityShortage} 
        /> */}

        <AddMachineButton onPress={() => setModalVisible(true)} />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3D4EB0" />
          </View>
        ) : (
          <View style={styles.machinesContainer}>
            {machines.length > 0 ? (
              machines.map(machine => (
                <MachineCard
                  key={machine.id}
                  machine={machine}
                  onEdit={handleEditMachine}
                  onDelete={handleDeleteMachine}
                />
              ))
            ) : (
              <Text style={styles.noMachinesText}>No machines available</Text>
            )}
          </View>
        )}

        {/* Add Machine Modal */}
        <AddMachineModal
          visible={modalVisible}
          onClose={resetAddMachineForm}
          machineNumber={newMachineNumber}
          setMachineNumber={setNewMachineNumber}
          underMaintenance={underMaintenance}
          setUnderMaintenance={setUnderMaintenance}
          onSubmit={handleAddMachine}
        />

        {/* Edit Machine Modal */}
        <EditMachineModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          machine={currentMachine}
          underMaintenance={underMaintenance}
          setUnderMaintenance={setUnderMaintenance}
          onSubmit={handleUpdateMachine}
        />
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
    paddingBottom: 140, // Ensure content can scroll beyond bottom tabs
  },
  machinesContainer: {
    flex: 1,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  noMachinesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
});

export default AdminMachinePage;