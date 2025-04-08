// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Platform,
//   Linking,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   Modal,
//   Switch
// } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import { PageHeader } from '../../components/common';

// const AdminEntries = ({ navigation }) => {
//   // States
//   const [searchQuery, setSearchQuery] = useState('');
//   const [students, setStudents] = useState([]);
//   const [filteredStudents, setFilteredStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [editModalVisible, setEditModalVisible] = useState(false);
  
//   // Form states for editing
//   const [editName, setEditName] = useState('');
//   const [editRollNo, setEditRollNo] = useState('');
//   const [editEmail, setEditEmail] = useState('');
//   const [editRoomNo, setEditRoomNo] = useState('');
  
//   // Get current user
//   const currentUser = auth().currentUser;

//   // Check if user is logged in
//   useEffect(() => {
//     if (!currentUser) {
//       Alert.alert('Error', 'You must be logged in to access this page.');
//       navigation.goBack();
//     } else {
//       fetchStudents();
//     }
//   }, [currentUser, navigation]);
  
//   // After fetching students, log their penalty status for debugging
//   useEffect(() => {
//     if (students.length > 0) {
//       console.log('==== STUDENTS PENALTY STATUS ====');
//       students.forEach(student => {
//         console.log(`${student.Name || 'Unknown'}: hasPenaltyNotification=${student.hasPenaltyNotification}, penaltyUntil=${student.penaltyUntil}`);
//       });
//     }
//   }, [students]);

//   // Fetch students from Firestore
//   const fetchStudents = async () => {
//     setLoading(true);
//     try {
//       const snapshot = await firestore()
//         .collection('students')
//         .get();
      
//       const studentsList = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
      
//       setStudents(studentsList);
//       // Don't show students by default - only set empty array
//       setFilteredStudents([]);
//     } catch (error) {
//       console.error('Error fetching students:', error);
//       Alert.alert('Error', 'Failed to fetch student data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle search
//   const handleSearch = (text) => {
//     setSearchQuery(text);
    
//     if (text.trim() === '') {
//       // When search is empty, don't display any students
//       setFilteredStudents([]);
//       return;
//     }
    
//     const filtered = students.filter(student => {
//       // Search by roll number (primary) or name (secondary)
//       return (
//         (student.RollNo && student.RollNo.toLowerCase().includes(text.toLowerCase())) ||
//         (student.Name && student.Name.toLowerCase().includes(text.toLowerCase()))
//       );
//     });
    
//     setFilteredStudents(filtered);
//   };

//   useEffect(() => {
//     // Only set up listeners if we have filtered students to watch
//     if (filteredStudents.length === 0) return;
    
//     console.log('Setting up real-time penalty listeners for filtered students');
    
//     // Create an array to hold all the unsubscribe functions
//     const unsubscribes = [];
    
//     // Set up a listener for each filtered student
//     filteredStudents.forEach(student => {
//       const unsubscribe = firestore()
//         .collection('students')
//         .doc(student.id)
//         .onSnapshot(
//           doc => {
//             if (!doc.exists) return;
            
//             const updatedData = doc.data();
//             // Check if penalty status has changed
//             const currentPenaltyStatus = hasPenalty(student);
//             const newPenaltyStatus = updatedData.hasPenaltyNotification === true || 
//                                     (updatedData.penaltyUntil && new Date(updatedData.penaltyUntil) > new Date());
            
//             if (currentPenaltyStatus !== newPenaltyStatus) {
//               console.log(`Penalty status changed for ${student.Name}: ${currentPenaltyStatus} -> ${newPenaltyStatus}`);
              
//               // Update the students array
//               setStudents(prevStudents => 
//                 prevStudents.map(s => 
//                   s.id === student.id ? { ...s, ...updatedData } : s
//                 )
//               );
              
//               // Also update filtered students
//               setFilteredStudents(prevFiltered => 
//                 prevFiltered.map(s => 
//                   s.id === student.id ? { ...s, ...updatedData } : s
//                 )
//               );
//             }
//           },
//           error => {
//             console.error(`Error in real-time listener for student ${student.id}:`, error);
//           }
//         );
      
//       unsubscribes.push(unsubscribe);
//     });
    
//     // Clean up listeners when component unmounts or filtered students change
//     return () => {
//       console.log('Cleaning up penalty listeners');
//       unsubscribes.forEach(unsubscribe => unsubscribe());
//     };
//   }, [filteredStudents]); // Dependency on filteredStudents so listeners update when search changes

//   // Check for penalty - improved detection
//   const hasPenalty = (student) => {
//     if(!student) return false;
//     // console.log(`Checking penalty for ${student.Name}:`, student.hasPenaltyNotification);
    
//     // Check various possible formats of the hasPenaltyNotification field
//     // Could be boolean true, string "true", or truthy value
//     if (student.hasPenaltyNotification === true) return true;
//     if (typeof student.hasPenaltyNotification === 'string' && 
//         student.hasPenaltyNotification.toLowerCase() === 'true') return true;
    
//     // Also check penaltyUntil as a backup to detect penalty
//     if (student.penaltyUntil) {
//       const penaltyDate = new Date(student.penaltyUntil);
//       const now = new Date();
//       if (penaltyDate > now) return true;
//     }
    
//     return false;
//   };

//   // Toggle penalty status - improved handling
//   const togglePenalty = async (student, value) => {
//     setLoading(true);
//     try {
//       console.log(`Toggling penalty for ${student.Name} to ${value}`);
      
//       // Always set both fields for consistency
//       await firestore()
//         .collection('students')
//         .doc(student.id)
//         .update({
//           hasPenaltyNotification: value,
//           penaltyUntil: value ? new Date(Date.now() + 50*1000).toISOString() : null, // 24 hours if turning on
//         });
      
//       // Update local state
//       const updatedStudents = students.map(s => {
//         if (s.id === student.id) {
//           return { 
//             ...s, 
//             hasPenaltyNotification: value,
//             penaltyUntil: value ? new Date(Date.now() + 50*1000).toISOString() : null,
//           };
//         }
//         return s;
//       });
      
//       setStudents(updatedStudents);
//       setFilteredStudents(
//         searchQuery.trim() === '' 
//           ? [] 
//           : updatedStudents.filter(s => 
//               s.RollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
//               s.Name.toLowerCase().includes(searchQuery.toLowerCase())
//             )
//       );
      
//       Alert.alert(
//         'Success', 
//         value ? 'Penalty applied successfully' : 'Penalty removed successfully'
//       );
//     } catch (error) {
//       console.error('Error toggling penalty:', error);
//       Alert.alert('Error', 'Failed to update penalty status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Remove penalty function (kept for compatibility)
//   const removePenalty = async (student) => {
//     return togglePenalty(student, false);
//   };

//   // Open edit modal
//   const openEditModal = (student) => {
//     setSelectedStudent(student);
//     setEditName(student.Name || '');
//     setEditRollNo(student.RollNo || '');
//     setEditEmail(student.Email || '');
//     setEditRoomNo(student.RoomNo || '');
//     setEditModalVisible(true);
//   };

//   // Save student edits
//   const saveStudentEdits = async () => {
//     if (!selectedStudent) return;
    
//     setLoading(true);
//     try {
//       await firestore()
//         .collection('students')
//         .doc(selectedStudent.id)
//         .update({
//           Name: editName,
//           RollNo: editRollNo,
//           Email: editEmail,
//           RoomNo: editRoomNo,
//         });
      
//       // Update local state
//       const updatedStudents = students.map(student => {
//         if (student.id === selectedStudent.id) {
//           return {
//             ...student,
//             Name: editName,
//             RollNo: editRollNo,
//             Email: editEmail,
//             RoomNo: editRoomNo,
//           };
//         }
//         return student;
//       });
      
//       setStudents(updatedStudents);
//       setFilteredStudents(
//         searchQuery.trim() === '' 
//           ? [] 
//           : updatedStudents.filter(student => 
//               student.RollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
//               student.Name.toLowerCase().includes(searchQuery.toLowerCase())
//             )
//       );
      
//       setEditModalVisible(false);
//       Alert.alert('Success', 'Student information updated successfully');
//     } catch (error) {
//       console.error('Error updating student:', error);
//       Alert.alert('Error', 'Failed to update student information');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUploadExcel = () => {
//     Linking.openURL('https://whirl-wash-excel-uploader.vercel.app/');
//   };

//   // Render student item
//   const renderStudentItem = ({ item }) => (
//     <View style={styles.studentCard}>
//       <View style={styles.studentInfo}>
//         <Text style={styles.studentName}>{item.Name}</Text>
//         <Text style={styles.studentDetail}>Roll No: {item.RollNo}</Text>
//         <Text style={styles.studentDetail}>Email: {item.Email}</Text>
//         <Text style={styles.studentDetail}>Room: {item.RoomNo}</Text>
//         <Text style={styles.studentDetail}>Role: {item.Role}</Text>
//         <Text style={styles.studentDetail}>Mobile: {item.MobileNo}</Text>
//         {hasPenalty(item) && (
//           <View style={styles.penaltyBadge}>
//             <Text style={styles.penaltyText}>Penalty Applied</Text>
//             {item.penaltyUntil && (
//               <Text style={styles.penaltyDetailText}>
//                 Applied: {new Date(item.penaltyUntil).toLocaleDateString()}
//               </Text>
//             )}
//           </View>
//         )}
//       </View>
      
//       <View style={styles.actionButtonsContainer}>
//         <TouchableOpacity
//           style={styles.editButton}
//           onPress={() => openEditModal(item)}
//         >
//           <Text style={styles.actionButtonText}>Edit</Text>
//         </TouchableOpacity>
        
//         <View style={styles.penaltyToggleContainer}>
//           <Text style={styles.penaltyToggleLabel}>Penalty:</Text>
//           <Switch
//             trackColor={{ false: "#767577", true: "#d32f2f" }}
//             thumbColor={hasPenalty(item) ? "#f4f3f4" : "#f4f3f4"}
//             ios_backgroundColor="#3e3e3e"
//             onValueChange={(value) => togglePenalty(item, value)}
//             value={hasPenalty(item)}
//             disabled={loading}
//             style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}} // Make the switch bigger
//           />
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
//       <View style={styles.headerContainer}>
//         <PageHeader 
//           title="Admin Entries" 
//           subtitle="Manage student data" 
//         />
//       </View>
      
//       <View style={styles.mainContainer}>
//         {/* Excel Upload Section - Now at the top */}
//         <View style={styles.fixedTopSection}>
//           <View style={styles.uploadContainer}>
//             <Text style={styles.sectionTitle}>Excel Upload</Text>
//             <Text style={styles.sectionDescription}>
//               Upload Excel files to import entries in the system.
//             </Text>
            
//             <TouchableOpacity 
//               style={styles.button}
//               onPress={handleUploadExcel}
//             >
//               <Text style={styles.buttonText}>Upload Excel</Text>
//             </TouchableOpacity>
//           </View>
          
//           {/* Search Bar - Now below the Excel upload */}
//           <View style={styles.searchContainer}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search by Roll Number or Name (type to see results)"
//               value={searchQuery}
//               onChangeText={handleSearch}
//             />
//           </View>
//         </View>

//         {/* Scrollable Student List */}
//         <ScrollView style={styles.scrollableSection} contentContainerStyle={styles.scrollContentContainer}>
//           {/* Student List */}
//           {loading && !editModalVisible ? (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color="#3D4EB0" />
//               <Text style={styles.loadingText}>Loading students...</Text>
//             </View>
//           ) : (
//             <View style={styles.listViewContainer}>
//               {filteredStudents.length > 0 ? (
//                 filteredStudents.map(item => renderStudentItem({ item }))
//               ) : (
//                 <View style={styles.emptyContainer}>
//                   <Text style={styles.emptyText}>
//                     {searchQuery.trim() !== '' 
//                       ? 'No students found matching your search.' 
//                       : 'Type in the search box to find students.'}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           )}
//         </ScrollView>
//       </View>
      
//       {/* Edit Student Modal */}
//       <Modal
//         visible={editModalVisible}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setEditModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Edit Student Details</Text>
            
//             <Text style={styles.inputLabel}>Full Name</Text>
//             <TextInput
//               style={styles.modalInput}
//               value={editName}
//               onChangeText={setEditName}
//               placeholder="Enter student name"
//             />
            
//             <Text style={styles.inputLabel}>Roll Number</Text>
//             <TextInput
//               style={styles.modalInput}
//               value={editRollNo}
//               onChangeText={setEditRollNo}
//               placeholder="Enter roll number"
//             />
            
//             <Text style={styles.inputLabel}>Email</Text>
//             <TextInput
//               style={styles.modalInput}
//               value={editEmail}
//               onChangeText={setEditEmail}
//               placeholder="Enter email address"
//               keyboardType="email-address"
//             />
            
//             <Text style={styles.inputLabel}>Room Number</Text>
//             <TextInput
//               style={styles.modalInput}
//               value={editRoomNo}
//               onChangeText={setEditRoomNo}
//               placeholder="Enter room number"
//             />
            
//             <View style={styles.modalButtons}>
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setEditModalVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.saveButton]}
//                 onPress={saveStudentEdits}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator size="small" color="#FFFFFF" />
//                 ) : (
//                   <Text style={styles.saveButtonText}>Save Changes</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   headerContainer: {
//     paddingHorizontal: 15,
//     paddingBottom: 5,
//     backgroundColor: '#F5F5F5',
//   },
//   mainContainer: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   fixedTopSection: {
//     backgroundColor: '#F5F5F5',
//     paddingBottom: 5,
//     zIndex: 1,
//   },
//   scrollableSection: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   scrollContentContainer: {
//     flexGrow: 1,
//     paddingBottom: 80, // Add more bottom padding to account for navigation bar
//   },
//   listViewContainer: {
//     paddingHorizontal: 15,
//   },
//   searchContainer: {
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     margin: 15,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   searchInput: {
//     height: 46,
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 6,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     backgroundColor: '#F9F9F9',
//   },
//   listContainer: {
//     padding: 10,
//   },
//   studentCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     marginBottom: 16,
//     padding: 15, 
//     paddingBottom: 20, // Add extra padding at bottom for buttons
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   studentInfo: {
//     marginBottom: 10,
//   },
//   studentName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   studentDetail: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 3,
//   },
//   penaltyBadge: {
//     backgroundColor: '#FFE5E5',
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     borderRadius: 4,
//     alignSelf: 'flex-start',
//     marginTop: 5,
//   },
//   penaltyText: {
//     color: '#D32F2F',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   penaltyDetailText: {
//     color: '#D32F2F',
//     fontSize: 10,
//   },
//   actionButtonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     flexWrap: 'wrap',
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   penaltyToggleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginLeft: 10,
//   },
//   penaltyToggleLabel: {
//     marginRight: 8,
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#555',
//   },
//   editButton: {
//     backgroundColor: '#3D4EB0',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//     marginLeft: 10,
//     marginBottom: 8, // Add bottom margin for wrapping
//   },
//   removeButton: {
//     backgroundColor: '#D32F2F',
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 4,
//     marginLeft: 10,
//     marginBottom: 8, // Add bottom margin for wrapping
//   },
//   actionButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   uploadContainer: {
//     padding: 15,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 8,
//     margin: 15,
//     marginTop: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 8,
//   },
//   sectionDescription: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#B03D4E',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   loadingContainer: {
//     padding: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555',
//   },
//   emptyContainer: {
//     padding: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//     width: '90%',
//     maxWidth: 500,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   inputLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#555',
//     marginBottom: 5,
//   },
//   modalInput: {
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//     borderRadius: 5,
//     height: 46,
//     paddingHorizontal: 15,
//     fontSize: 16,
//     backgroundColor: '#F9F9F9',
//     marginBottom: 15,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   modalButton: {
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cancelButton: {
//     backgroundColor: '#F0F0F0',
//     marginRight: 10,
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontWeight: 'bold',
//   },
//   saveButton: {
//     backgroundColor: '#3D4EB0',
//     marginLeft: 10,
//   },
//   saveButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
// });

// export default AdminEntries;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Linking,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  Switch,
  KeyboardAvoidingView,
  Dimensions
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { PageHeader } from '../../components/common';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

const AdminEntries = ({ navigation }) => {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  
  // Form states for editing
  const [editName, setEditName] = useState('');
  const [editRollNo, setEditRollNo] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRoomNo, setEditRoomNo] = useState('');
  
  // Get current user
  const currentUser = auth().currentUser;

  // Check if user is logged in
  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to access this page.');
      navigation.goBack();
    } else {
      fetchStudents();
    }
  }, [currentUser, navigation]);
  
  // After fetching students, log their penalty status for debugging
  useEffect(() => {
    if (students.length > 0) {
      console.log('==== STUDENTS PENALTY STATUS ====');
      students.forEach(student => {
        console.log(`${student.Name || 'Unknown'}: hasPenaltyNotification=${student.hasPenaltyNotification}, penaltyUntil=${student.penaltyUntil}`);
      });
    }
  }, [students]);

  // Fetch students from Firestore
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const snapshot = await firestore()
        .collection('students')
        .get();
      
      const studentsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setStudents(studentsList);
      // Don't show students by default - only set empty array
      setFilteredStudents([]);
    } catch (error) {
      console.error('Error fetching students:', error);
      Alert.alert('Error', 'Failed to fetch student data');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      // When search is empty, don't display any students
      setFilteredStudents([]);
      return;
    }
    
    const filtered = students.filter(student => {
      // Search by roll number (primary) or name (secondary)
      return (
        (student.RollNo && student.RollNo.toLowerCase().includes(text.toLowerCase())) ||
        (student.Name && student.Name.toLowerCase().includes(text.toLowerCase()))
      );
    });
    
    setFilteredStudents(filtered);
  };

  useEffect(() => {
    // Only set up listeners if we have filtered students to watch
    if (filteredStudents.length === 0) return;
    
    console.log('Setting up real-time penalty listeners for filtered students');
    
    // Create an array to hold all the unsubscribe functions
    const unsubscribes = [];
    
    // Set up a listener for each filtered student
    filteredStudents.forEach(student => {
      const unsubscribe = firestore()
        .collection('students')
        .doc(student.id)
        .onSnapshot(
          doc => {
            if (!doc.exists) return;
            
            const updatedData = doc.data();
            // Check if penalty status has changed
            const currentPenaltyStatus = hasPenalty(student);
            const newPenaltyStatus = updatedData.hasPenaltyNotification === true || 
                                    (updatedData.penaltyUntil && new Date(updatedData.penaltyUntil) > new Date());
            
            if (currentPenaltyStatus !== newPenaltyStatus) {
              console.log(`Penalty status changed for ${student.Name}: ${currentPenaltyStatus} -> ${newPenaltyStatus}`);
              
              // Update the students array
              setStudents(prevStudents => 
                prevStudents.map(s => 
                  s.id === student.id ? { ...s, ...updatedData } : s
                )
              );
              
              // Also update filtered students
              setFilteredStudents(prevFiltered => 
                prevFiltered.map(s => 
                  s.id === student.id ? { ...s, ...updatedData } : s
                )
              );
            }
          },
          error => {
            console.error(`Error in real-time listener for student ${student.id}:`, error);
          }
        );
      
      unsubscribes.push(unsubscribe);
    });
    
    // Clean up listeners when component unmounts or filtered students change
    return () => {
      console.log('Cleaning up penalty listeners');
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [filteredStudents]); // Dependency on filteredStudents so listeners update when search changes

  // Check for penalty - improved detection
  const hasPenalty = (student) => {
    if(!student) return false;
    // console.log(`Checking penalty for ${student.Name}:`, student.hasPenaltyNotification);
    
    // Check various possible formats of the hasPenaltyNotification field
    // Could be boolean true, string "true", or truthy value
    if (student.hasPenaltyNotification === true) return true;
    if (typeof student.hasPenaltyNotification === 'string' && 
        student.hasPenaltyNotification.toLowerCase() === 'true') return true;
    
    // Also check penaltyUntil as a backup to detect penalty
    if (student.penaltyUntil) {
      const penaltyDate = new Date(student.penaltyUntil);
      const now = new Date();
      if (penaltyDate > now) return true;
    }
    
    return false;
  };

  // Toggle penalty status - improved handling
  const togglePenalty = async (student, value) => {
    setLoading(true);
    try {
      console.log(`Toggling penalty for ${student.Name} to ${value}`);
      
      // Always set both fields for consistency
      await firestore()
        .collection('students')
        .doc(student.id)
        .update({
          hasPenaltyNotification: value,
          penaltyUntil: value ? new Date(Date.now() + 50*1000).toISOString() : null, // 50 seconds if turning on
        });
      
      // Update local state
      const updatedStudents = students.map(s => {
        if (s.id === student.id) {
          return { 
            ...s, 
            hasPenaltyNotification: value,
            penaltyUntil: value ? new Date(Date.now() + 50*1000).toISOString() : null,
          };
        }
        return s;
      });
      
      setStudents(updatedStudents);
      setFilteredStudents(
        searchQuery.trim() === '' 
          ? [] 
          : updatedStudents.filter(s => 
              s.RollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
              s.Name.toLowerCase().includes(searchQuery.toLowerCase())
            )
      );
      
      Alert.alert(
        'Success', 
        value ? 'Penalty applied successfully' : 'Penalty removed successfully'
      );
    } catch (error) {
      console.error('Error toggling penalty:', error);
      Alert.alert('Error', 'Failed to update penalty status');
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (student) => {
    setSelectedStudent(student);
    setEditName(student.Name || '');
    setEditRollNo(student.RollNo || '');
    setEditEmail(student.Email || '');
    setEditRoomNo(student.RoomNo || '');
    setEditModalVisible(true);
  };

  // Save student edits
  const saveStudentEdits = async () => {
    if (!selectedStudent) return;
    
    setLoading(true);
    try {
      await firestore()
        .collection('students')
        .doc(selectedStudent.id)
        .update({
          Name: editName,
          RollNo: editRollNo,
          Email: editEmail,
          RoomNo: editRoomNo,
        });
      
      // Update local state
      const updatedStudents = students.map(student => {
        if (student.id === selectedStudent.id) {
          return {
            ...student,
            Name: editName,
            RollNo: editRollNo,
            Email: editEmail,
            RoomNo: editRoomNo,
          };
        }
        return student;
      });
      
      setStudents(updatedStudents);
      setFilteredStudents(
        searchQuery.trim() === '' 
          ? [] 
          : updatedStudents.filter(student => 
              student.RollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
              student.Name.toLowerCase().includes(searchQuery.toLowerCase())
            )
      );
      
      setEditModalVisible(false);
      Alert.alert('Success', 'Student information updated successfully');
    } catch (error) {
      console.error('Error updating student:', error);
      Alert.alert('Error', 'Failed to update student information');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadExcel = () => {
    Linking.openURL('https://whirl-wash-excel-uploader.vercel.app/');
  };

  // Render student item
  const renderStudentItem = (item) => (
    <View style={styles.studentCard} key={item.id}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.Name}</Text>
        <Text style={styles.studentDetail}>Roll No: {item.RollNo}</Text>
        <Text style={styles.studentDetail}>Email: {item.Email}</Text>
        <Text style={styles.studentDetail}>Room: {item.RoomNo}</Text>
        <Text style={styles.studentDetail}>Role: {item.Role}</Text>
        <Text style={styles.studentDetail}>Mobile: {item.MobileNo}</Text>
        {hasPenalty(item) && (
          <View style={styles.penaltyBadge}>
            <Text style={styles.penaltyText}>Penalty Applied</Text>
            {item.penaltyUntil && (
              <Text style={styles.penaltyDetailText}>
                Applied: {new Date(item.penaltyUntil).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <View style={styles.penaltyToggleContainer}>
          <Text style={styles.penaltyToggleLabel}>Penalty:</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#d32f2f" }}
            thumbColor={hasPenalty(item) ? "#f4f3f4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => togglePenalty(item, value)}
            value={hasPenalty(item)}
            disabled={loading}
            style={styles.penaltySwitch}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          bounces={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerContainer}>
            <PageHeader 
              title="LNMIIT Admin Panel" 
              subtitle="Manage student data" 
            />
          </View>
          
          {/* Excel Upload Section */}
          <View style={styles.uploadContainer}>
            <Text style={styles.sectionTitle}>Excel Upload</Text>
            <Text style={styles.sectionDescription}>
              Upload Excel files to import entries in the system.
            </Text>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleUploadExcel}
            >
              <Text style={styles.buttonText}>Upload Excel</Text>
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Roll Number or Name"
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
          </View>
          
          {/* Student List */}
          {loading && !editModalVisible ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3D4EB0" />
              <Text style={styles.loadingText}>Loading students...</Text>
            </View>
          ) : (
            <View style={styles.listViewContainer}>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(item => renderStudentItem(item))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchQuery.trim() !== '' 
                      ? 'No students found matching your search.' 
                      : 'Type in the search box to find students.'}
                  </Text>
                </View>
              )}
            </View>
          )}
          
          {/* Add extra padding at the bottom for better scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Edit Student Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardAvoidingModal}
          >
            <ScrollView 
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Student Details</Text>
                
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter student name"
                />
                
                <Text style={styles.inputLabel}>Roll Number</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editRollNo}
                  onChangeText={setEditRollNo}
                  placeholder="Enter roll number"
                />
                
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                
                <Text style={styles.inputLabel}>Room Number</Text>
                <TextInput
                  style={styles.modalInput}
                  value={editRoomNo}
                  onChangeText={setEditRoomNo}
                  placeholder="Enter room number"
                />
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setEditModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={saveStudentEdits}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  headerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    backgroundColor: '#F5F5F5',
    width: '100%',
  },
  uploadContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 15,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    height: 46,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  listViewContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
    width: '100%',
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  studentInfo: {
    marginBottom: 10,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  studentDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  penaltyBadge: {
    backgroundColor: '#FFE5E5',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  penaltyText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  penaltyDetailText: {
    color: '#D32F2F',
    fontSize: 10,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  penaltyToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flexWrap: 'wrap',
  },
  penaltyToggleLabel: {
    marginRight: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  penaltySwitch: {
    transform: [{scaleX: 1.2}, {scaleY: 1.2}],
  },
  editButton: {
    backgroundColor: '#3D4EB0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginVertical: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#B03D4E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingModal: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 5,
    height: 46,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#3D4EB0',
    marginLeft: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 100, // Add extra padding at the bottom
  },
});

export default AdminEntries