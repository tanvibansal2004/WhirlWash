import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Linking
} from 'react-native';
import auth from '@react-native-firebase/auth';

// Assuming you're using the same PageHeader component
import { PageHeader } from '../../components/common';

const AdminEntries = ({ navigation }) => {
  // Get current user
  const currentUser = auth().currentUser;

  // Check if user is logged in
  if (!currentUser) {
    Alert.alert('Error', 'You must be logged in to access this page.');
    navigation.goBack();
    return null;
  }

  const handleUploadExcel = () => {
    Linking.openURL('https://whirl-wash-excel-uploader.vercel.app/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={styles.headerContainer}>
        <PageHeader 
          title="Admin Entries" 
          subtitle="Manage entry data" 
        />
      </View>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
    backgroundColor: '#3D4EB0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default AdminEntries;