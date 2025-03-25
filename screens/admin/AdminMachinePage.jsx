import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';

const AdminMachinePage = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [newMachineNumber, setNewMachineNumber] = useState('');
  const [underMaintenance, setUnderMaintenance] = useState(false);

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  const currentUser = auth().currentUser;

  useEffect(() => {
    // Check if current user is admin
    const checkAdminStatus = async () => {
      if (currentUser) {
        try {
          const adminRef = firestore().collection('admins');
          const snapshot = await adminRef
            .where('email', '==', currentUser.email)
            .get();

          if (!snapshot.empty) {
            setIsAdmin(true);
          } else {
            Alert.alert(
              'Access Denied',
              'You do not have permission to access this page.',
            );
            // Here you might want to navigate away if using a navigation library
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          Alert.alert('Error', 'Failed to verify admin permissions.');
        }
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  useEffect(() => {
    if (!isAdmin) return;

    // Set up real-time listener for machine collection
    const unsubscribe = firestore()
      .collection('machines')
      .onSnapshot(
        snapshot => {
          const machinesList = [];

          snapshot.forEach(doc => {
            const data = doc.data();
            machinesList.push({id: doc.id, ...data});
          });

          // Sort machines by number
          machinesList.sort((a, b) => {
            return (a.number || 0) - (b.number || 0);
          });

          setMachines(machinesList);
          setLoading(false);
        },
        error => {
          console.error('Error listening to machines collection:', error);
          Alert.alert('Error', 'Failed to load machine data.');
          setLoading(false);
        },
      );

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [isAdmin]);

  const handleAddMachine = async () => {
    try {
      if (!newMachineNumber || newMachineNumber.trim() === '') {
        Alert.alert('Error', 'Please enter a valid machine number.');
        return;
      }

      // Check if machine number already exists
      const machineQuery = await firestore()
        .collection('machines')
        .where('number', '==', Number(newMachineNumber))
        .get();

      if (!machineQuery.empty) {
        Alert.alert('Error', 'A machine with this number already exists.');
        return;
      }

      await firestore()
        .collection('machines')
        .add({
          number: Number(newMachineNumber),
          inUse: false,
          underMaintenance: underMaintenance,
          status: underMaintenance ? 'maintenance' : 'available',
          bookedBy: null,
          autoUnbooked: false,
        });

      setNewMachineNumber('');
      setUnderMaintenance(false);
      setModalVisible(false);
      Alert.alert(
        'Success',
        `Machine No. ${newMachineNumber} added successfully.`,
      );
    } catch (error) {
      console.error('Error adding machine:', error);
      Alert.alert('Error', 'Failed to add machine.');
    }
  };

  const handleDeleteMachine = async machine => {
    try {
      Alert.alert(
        'Confirm Delete',
        `Are you sure you want to delete Machine No. ${machine.number}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await firestore().collection('machines').doc(machine.id).delete();
              Alert.alert('Success', `Machine No. ${machine.number} deleted.`);
            },
            style: 'destructive',
          },
        ],
      );
    } catch (error) {
      console.error('Error deleting machine:', error);
      Alert.alert('Error', 'Failed to delete machine.');
    }
  };

  const handleEditMachine = machine => {
    setCurrentMachine(machine);
    setUnderMaintenance(machine.underMaintenance || false);
    setEditModalVisible(true);
  };

  const handleUpdateMachine = async () => {
    try {
      if (!currentMachine) return;

      const prevStatus = currentMachine.underMaintenance;
      const newStatus = underMaintenance;

      const updateData = {
        underMaintenance: underMaintenance,
        status: underMaintenance
          ? 'maintenance'
          : currentMachine.inUse
          ? 'in-use'
          : 'available',
      };

      // If machine was in use and now under maintenance, release booking
      if (currentMachine.inUse && underMaintenance) {
        updateData.inUse = false;
        updateData.bookedBy = null;
      }

      await firestore()
        .collection('machines')
        .doc(currentMachine.id)
        .update(updateData);

      setEditModalVisible(false);

      const statusChangeMsg =
        prevStatus !== newStatus
          ? `Machine No. ${currentMachine.number} ${
              underMaintenance
                ? 'marked as under maintenance'
                : 'marked as operational'
            }.`
          : `Machine No. ${currentMachine.number} updated.`;

      Alert.alert('Success', statusChangeMsg);
    } catch (error) {
      console.error('Error updating machine:', error);
      Alert.alert('Error', 'Failed to update machine.');
    }
  };

  const renderMachineStatus = machine => {
    if (machine.underMaintenance) {
      return <Text style={styles.maintenanceStatus}>Under Maintenance</Text>;
    } else if (machine.inUse) {
      return <Text style={styles.inUseStatus}>In Use</Text>;
    } else {
      return <Text style={styles.availableStatus}>Available</Text>;
    }
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Access Restricted</Text>
        <Text style={styles.subheading}>Admin permissions required</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>LNMIIT Admin Panel</Text>
        <Text style={styles.subheading}>WhirlWash</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Icon name="pluscircle" size={20} color="white" />
          <Text style={styles.addButtonText}>Add New Machine</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3D4EB0" />
          </View>
        ) : (
          <View style={styles.machinesContainer}>
            {machines.length > 0 ? (
              machines.map(machine => (
                <View key={machine.id} style={styles.machineCard}>
                  <View style={styles.machineHeader}>
                    <Text style={styles.machineTitle}>
                      Machine No. {machine.number}
                    </Text>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditMachine(machine)}>
                        <Icon name="setting" size={24} color="#3D4EB0" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteMachine(machine)}>
                        <Icon name="delete" size={24} color="#E53935" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.machineDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status:</Text>
                      {renderMachineStatus(machine)}
                    </View>

                    {machine.inUse && (
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
                    )}

                    {!machine.inUse && machine.lastUsedBy && (
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
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noMachinesText}>No machines available</Text>
            )}
          </View>
        )}

        {/* Add Machine Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Machine</Text>

              <TextInput
                style={styles.input}
                placeholder="Machine Number"
                value={newMachineNumber}
                onChangeText={setNewMachineNumber}
                keyboardType="numeric"
              />

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Under Maintenance:</Text>
                <Switch
                  value={underMaintenance}
                  onValueChange={setUnderMaintenance}
                  trackColor={{false: '#767577', true: '#E53935'}}
                  thumbColor={underMaintenance ? '#f4f3f4' : '#f4f3f4'}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setNewMachineNumber('');
                    setUnderMaintenance(false);
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleAddMachine}>
                  <Text style={styles.buttonText}>Add Machine</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Edit Machine Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Edit Machine {currentMachine?.number}
              </Text>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Under Maintenance:</Text>
                <Switch
                  value={underMaintenance}
                  onValueChange={setUnderMaintenance}
                  trackColor={{false: '#767577', true: '#E53935'}}
                  thumbColor={underMaintenance ? '#f4f3f4' : '#f4f3f4'}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setEditModalVisible(false);
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.submitButton]}
                  onPress={handleUpdateMachine}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    paddingBottom: 140, // Ensure content can scroll beyond bottom tabs
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subheading: {
    fontSize: 16,
    color: '#B03D4E',
    textAlign: 'center',
    marginBottom: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
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
  machinesContainer: {
    flex: 1,
  },
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
  deleteButton: {},
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
  noMachinesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
  },
  submitButton: {
    backgroundColor: '#3D4EB0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminMachinePage;
