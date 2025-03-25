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
  FlatList,
  TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';
import {format} from 'date-fns';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const AdminLogsPage = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [machines, setMachines] = useState([]);
  const [usageLogs, setUsageLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = auth().currentUser;

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

  // Check if user is admin (unchanged)
  useEffect(() => {
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
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          Alert.alert('Error', 'Failed to verify admin permissions.');
        }
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  // Fetch machines and usage logs
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
        setFilteredLogs(logs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load machine logs data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  // Filter logs based on selected machine and search query
  useEffect(() => {
    let result = [...usageLogs];

    // Filter by machine
    if (selectedMachine !== 'all') {
      result = result.filter(
        log => log.machineNumber === parseInt(selectedMachine),
      );
    }

    // Filter by search query (student name, roll number, or mobile)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        log =>
          (log.userName && log.userName.toLowerCase().includes(query)) ||
          (log.userEmail && log.userEmail.toLowerCase().includes(query)) ||
          (log.userMobile && log.userMobile.toLowerCase().includes(query)),
      );
    }

    setFilteredLogs(result);
  }, [selectedMachine, searchQuery, usageLogs]);

  // Format timestamp
  // const formatTimestamp = timestamp => {
  //   if (!timestamp) return 'Unknown';

  //   try {
  //     const date =
  //       timestamp instanceof firestore.Timestamp
  //         ? timestamp.toDate()
  //         : new Date(timestamp);

  //     return date.toLocaleString();
  //   } catch (error) {
  //     console.error('Error formatting timestamp:', error);
  //     return 'Invalid Date';
  //   }
  // };

  // Format timestamp
  const formatTimestamp = timestamp => {
    if (!timestamp) return 'Unknown';

    try {
      const date =
        timestamp instanceof firestore.Timestamp
          ? timestamp.toDate()
          : new Date(timestamp);

      return format(date, 'MMM d, yyyy • h:mm a');
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  };

  // Group logs by machine number
  const groupLogsByMachine = () => {
    const groupedLogs = {};
    filteredLogs.forEach(log => {
      if (!groupedLogs[log.machineNumber]) {
        groupedLogs[log.machineNumber] = [];
      }
      groupedLogs[log.machineNumber].push(log);
    });
    return groupedLogs;
  };

  // Render log item
  // const renderLogItem = ({item}) => (
  //   <View style={styles.logCard}>
  //     <View style={styles.logHeader}>
  //       <Text style={styles.logTitle}>
  //         {item.machineNumber
  //           ? `Machine No. ${item.machineNumber}`
  //           : 'Unknown Machine'}
  //       </Text>
  //       <Text style={styles.logTimestamp}>
  //         {formatTimestamp(item.timestamp)}
  //       </Text>
  //     </View>

  //     <View style={styles.logDetails}>
  //       <View style={styles.detailRow}>
  //         <Text style={styles.detailLabel}>Student:</Text>
  //         <Text style={styles.detailValue}>{item.userName}</Text>
  //       </View>

  //       <View style={styles.detailRow}>
  //         <Text style={styles.detailLabel}>Roll No:</Text>
  //         <Text style={styles.detailValue}>{item.userEmail}</Text>
  //       </View>

  //       <View style={styles.detailRow}>
  //         <Text style={styles.detailLabel}>Mobile:</Text>
  //         <Text style={styles.detailValue}>{item.userMobile}</Text>
  //       </View>
  //     </View>
  //   </View>
  // );

  // Render log item
  // const renderMachineLogCard = (machineNumber, logs) => {
  //   // Take up to the last 3 logs for the machine
  //   const displayLogs = logs.slice(0, 3);

  //   return (
  //     <View key={machineNumber} style={styles.machineLogCard}>
  //       <View style={styles.machineHeader}>
  //         <View style={styles.machineHeaderContent}>
  //           <MaterialIcon name="local-laundry-service" size={24} color="#3D4EB0" />
  //           <Text style={styles.machineTitle}>Machine No. {machineNumber}</Text>
  //         </View>
  //         <Text style={styles.machineSubtitle}>
  //           {displayLogs.length} recent uses
  //         </Text>
  //       </View>

  //       {displayLogs.map((log, index) => (
  //         <View
  //           key={log.id}
  //           style={[
  //             styles.logEntry,
  //             index < displayLogs.length - 1 && styles.logEntrySeparator
  //           ]}
  //         >
  //           <View style={styles.logEntryDetails}>
  //             <Text style={styles.logStudentName}>
  //               {log.userName || 'Unknown Student'}
  //             </Text>
  //             <Text style={styles.logTimestamp}>
  //               {formatTimestamp(log.timestamp)}
  //             </Text>
  //           </View>
  //           <View style={styles.logEntryContact}>
  //             <Text style={styles.logContactDetail}>{log.userEmail}</Text>
  //             <Text style={styles.logContactDetail}>{log.userMobile}</Text>
  //           </View>
  //         </View>
  //       ))}

  //       {logs.length > 3 && (
  //         <TouchableOpacity style={styles.viewMoreButton}>
  //           <Text style={styles.viewMoreText}>View More Uses</Text>
  //         </TouchableOpacity>
  //       )}
  //     </View>
  //   );
  // };

  const renderMachineLogCard = (machineNumber, logs) => {
    // Only use actual logs with valid data
    const displayLogs = logs
      .filter(log => log.userName || log.userEmail || log.userMobile)
      .slice(0, 3);

    return (
      <View key={machineNumber} style={styles.machineLogCard}>
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
            <View
              key={log.id || `log-${index}`}
              style={[
                styles.logEntry,
                index < displayLogs.length - 1 && styles.logEntrySeparator,
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
          ))
        )}

        {/* {logs.length > 3 && (
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View More Uses</Text>
          </TouchableOpacity>
        )} */}
      </View>
    );
  };

  // const renderContent = () => {
  //   const groupedLogs = groupLogsByMachine();

  //   return (
  //     <View style={styles.logsContainer}>
  //       {Object.keys(groupedLogs).length > 0 ? (
  //         Object.entries(groupedLogs).map(([machineNumber, logs]) =>
  //           renderMachineLogCard(machineNumber, logs)
  //         )
  //       ) : (
  //         <Text style={styles.noLogsText}>No usage logs available</Text>
  //       )}
  //     </View>
  //   );
  // };

  const renderContent = () => {
    // Create a map of machine logs
    const machineLogsMap = {};
    filteredLogs.forEach(log => {
      if (!machineLogsMap[log.machineNumber]) {
        machineLogsMap[log.machineNumber] = [];
      }
      machineLogsMap[log.machineNumber].push(log);
    });

    // Render cards for all machines, including those with no logs
    // return (
    //   <View style={styles.logsContainer}>
    //     {machines.map(machine => renderMachineLogCard(
    //       machine,
    //       machineLogsMap[machine.number] || []
    //     ))}
    //   </View>
    // );

    // Ensure we return an array of valid machine log cards
    const machineLogCards = machines
      .map(machine =>
        renderMachineLogCard(
          machine.number,
          machineLogsMap[machine.number] || [],
        ),
      )
      .filter(card => card != null); // Remove any null cards

    // Return a view with the cards or a no logs message
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

  // Render access restricted view if not admin
  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Access Restricted</Text>
        <Text style={styles.subheading}>Admin permissions required</Text>
      </View>
    );
  }

  // return (
  //   <SafeAreaView style={styles.container}>
  //     <ScrollView
  //       style={styles.scrollView}
  //       contentContainerStyle={styles.scrollViewContent}
  //       keyboardShouldPersistTaps="handled">
  //       <Text style={styles.heading}>LNMIIT Admin Panel</Text>
  //       <Text style={styles.subheading}>WhirlWash - Machine Usage Logs</Text>

  //       <View style={styles.filtersContainer}>
  //         <View style={styles.filterItem}>
  //           <Text style={styles.filterLabel}>Machine:</Text>
  //           <View style={styles.pickerContainer}>
  //             <Picker
  //               selectedValue={selectedMachine}
  //               style={styles.picker}
  //               onValueChange={itemValue => setSelectedMachine(itemValue)}>
  //               <Picker.Item label="All Machines" value="all" />
  //               {machines.map(machine => (
  //                 <Picker.Item
  //                   key={machine.id}
  //                   label={`Machine ${machine.number}`}
  //                   value={machine.number.toString()}
  //                 />
  //               ))}
  //             </Picker>
  //           </View>
  //         </View>

  //         <View style={styles.searchContainer}>
  //           <TextInput
  //             style={styles.searchInput}
  //             placeholder="Search by name, roll no, or mobile"
  //             value={searchQuery}
  //             onChangeText={setSearchQuery}
  //           />
  //           {searchQuery.length > 0 && (
  //             <TouchableOpacity
  //               style={styles.clearButton}
  //               onPress={() => setSearchQuery('')}>
  //               <Icon name="close" size={20} color="#666" />
  //             </TouchableOpacity>
  //           )}
  //         </View>
  //       </View>

  //       {loading ? (
  //         <View style={styles.loaderContainer}>
  //           <ActivityIndicator size="large" color="#3D4EB0" />
  //         </View>
  //       ) : (
  //         <View style={styles.logsContainer}>
  //           {filteredLogs.length > 0 ? (
  //             <FlatList
  //               data={filteredLogs}
  //               renderItem={renderLogItem}
  //               keyExtractor={item => item.id}
  //               scrollEnabled={false}
  //             />
  //           ) : (
  //             <Text style={styles.noLogsText}>No usage logs available</Text>
  //           )}
  //         </View>
  //       )}
  //     </ScrollView>
  //   </SafeAreaView>
  // );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>LNMIIT Admin Panel</Text>
        <Text style={styles.subheading}>WhirlWash - Machine Usage Logs</Text>

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
  // ... (styles remain the same as in the previous code)
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logsContainer: {
    flex: 1,
  },
  logCard: {
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  logTimestamp: {
    fontSize: 14,
    color: '#666',
  },
  logDetails: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  detailLabel: {
    fontWeight: 'bold',
    width: 80,
  },
  detailValue: {
    flex: 1,
  },
  noLogsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
  // New and modified styles
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

export default AdminLogsPage;
