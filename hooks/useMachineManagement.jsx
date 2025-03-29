import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

const useMachineManagement = (isAdmin) => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [newMachineNumber, setNewMachineNumber] = useState('');
  const [underMaintenance, setUnderMaintenance] = useState(false);

  // Fetch machines
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

  // Add a new machine
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

  // Delete a machine
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

  // Edit machine
  const handleEditMachine = machine => {
    setCurrentMachine(machine);
    setUnderMaintenance(machine.underMaintenance || false);
    setEditModalVisible(true);
  };

  // Update machine
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

  const resetAddMachineForm = () => {
    setNewMachineNumber('');
    setUnderMaintenance(false);
    setModalVisible(false);
  };

  return {
    machines,
    loading,
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
  };
};

export default useMachineManagement;