import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

const useMachineLogsData = (isAdmin) => {
  const [machines, setMachines] = useState([]);
  const [usageLogs, setUsageLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch all machine usage logs
  const fetchMachineUsageLogs = async () => {
    try {
      const machinesSnapshot = await firestore()
        .collection('machines')
        .orderBy('number')
        .get();

      const machineUsageLogs = [];

      for (const machineDoc of machinesSnapshot.docs) {
        const machineData = machineDoc.data();

        // Check if lastUses exists and is an array
        if (machineData.lastUses && Array.isArray(machineData.lastUses)) {
          const machineLogs = machineData.lastUses.map((use, index) => ({
            id: `${machineDoc.id}-${index}`,
            machineNumber: machineData.number,
            machineId: machineDoc.id,
            userName: use.name,
            userEmail: use.email,
            userMobile: use.mobile,
            timestamp: use.timestamp,
          }));

          machineUsageLogs.push(...machineLogs);
        }
      }

      // Sort logs by timestamp in descending order
      machineUsageLogs.sort((a, b) => {
        const timestampA = a.timestamp?.seconds || 0;
        const timestampB = b.timestamp?.seconds || 0;
        return timestampB - timestampA;
      });

      return machineUsageLogs;
    } catch (error) {
      console.error('Error fetching machine usage logs:', error);
      return [];
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        // Fetch machines
        const machinesSnapshot = await firestore().collection('machines').get();
        const machinesList = [];

        machinesSnapshot.forEach(doc => {
          const data = doc.data();
          machinesList.push({id: doc.id, ...data});
        });

        // Sort machines by number
        machinesList.sort((a, b) => (a.number || 0) - (b.number || 0));
        setMachines(machinesList);

        // Fetch usage logs
        const logs = await fetchMachineUsageLogs();
        setUsageLogs(logs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load machine logs data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  return { machines, usageLogs, loading };
};

export default useMachineLogsData;