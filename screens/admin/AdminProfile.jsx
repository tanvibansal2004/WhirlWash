import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const AdminProfile = ({route, navigation}) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState(route?.params?.userEmail || null);

  const db = getFirestore(); // Firestore instance
  const auth = getAuth(); // Firebase Auth instance

  useEffect(() => {
    if (!userEmail) {
      fetchUserEmail();
    } else {
      fetchUserData(userEmail);
    }
  }, [userEmail]);

  // Get the admin's email from Firebase Auth or Google Sign-In if missing
  const fetchUserEmail = async () => {
    try {
      let email = null;

      // Get email from Firebase Auth (if signed in)
      if (auth.currentUser) {
        email = auth.currentUser.email;
      }

      // Get email from Google Sign-In (fallback)
      if (!email) {
        const googleUser = await GoogleSignin.getCurrentUser();
        email = googleUser?.user?.email || null;
      }

      if (!email) {
        throw new Error('User email not found');
      }

      setUserEmail(email);
      fetchUserData(email); // Fetch Firestore data after getting email
    } catch (error) {
      console.error('Error fetching admin email:', error);
      Alert.alert('Error', 'Failed to retrieve admin email.');
      setLoading(false);
    }
  };

  // Fetch admin data from Firestore using Modular SDK
  const fetchUserData = async email => {
    try {
      setLoading(true);

      if (!email) {
        throw new Error('Admin email is required to fetch data');
      }

      const q = query(collection(db, 'admins'), where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'Admin not found in database');
        setLoading(false);
        return;
      }

      // Extract first document
      const userDoc = querySnapshot.docs[0];
      setUserData(userDoc.data());
    } catch (error) {
      console.error('Error fetching admin data:', error);
      Alert.alert('Error', 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.warn('No admin currently signed in.');
        Alert.alert('Logout', 'No admin is currently signed in.');
        return;
      }

      await auth.signOut(); // Firebase Auth Logout
      await GoogleSignin.signOut(); // Google Sign-In Logout

      // Reset navigation stack to prevent going back after logout
      navigation.reset({
        index: 0,
        routes: [{name: 'Welcome'}],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const navigateToAdminHome = () => {
    // First try to reset to AdminMain
    try {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AdminMain' }],
      });
    } catch (error) {
      // If that fails, try other methods
      console.log('Navigation reset error:', error);
      try {
        navigation.navigate('AdminMain');
      } catch (error) {
        console.log('Navigation navigate error:', error);
        // Last resort - go back
        navigation.goBack();
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B03D4E" />
          <Text style={styles.loadingText}>Loading admin profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Admin data not found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserEmail}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          activeOpacity={0.7}
          onPress={navigateToAdminHome}>
          <View style={styles.buttonBackground}>
            <Icon
              name="chevron-back"
              size={30}
              color="black"
              style={{position: 'absolute', left: 20}}
            />
          </View>
        </TouchableOpacity>

        <Text style={styles.heading}>Admin Profile</Text>

        <Image source={require('../../assets/user.png')} style={styles.img} />
        <Text style={styles.name}>{userData.name}</Text>

        <View style={styles.detailsContainer}>
          <ProfileDetail label="Email" value={userData.email} />
          <ProfileDetail label="Role" value={userData.role} />
          {userData.department && (
            <ProfileDetail label="Department" value={userData.department} />
          )}
          {userData.contactNo && (
            <ProfileDetail label="Contact No." value={userData.contactNo} />
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#B03D4E" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          *For any system issues or updates to your profile, please contact the
          IT department.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileDetail = ({label, value}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: 'white',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 50, // Extra bottom padding for scrolling
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButtonContainer: {
    marginLeft: -10,
    width: 60,
    height: 40,
    justifyContent: 'center',
  },
  buttonBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  loadingText: {marginTop: 10, fontSize: 16, color: '#666'},
  errorText: {fontSize: 18, color: '#ff3b30', marginBottom: 20},
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#B03D4E', // Admin color theme
    borderRadius: 8,
  },
  retryText: {color: 'white', fontSize: 16, fontWeight: '600'},
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#B03D4E', // Admin color theme
  },
  img: {width: 100, height: 100, alignSelf: 'center', marginBottom: 10},
  name: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {marginBottom: 20},
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f0f1', // Lighter version of admin theme
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailLabel: {fontSize: 16, fontWeight: '600', color: '#555'},
  detailValue: {fontSize: 16, fontWeight: '400'},
  logoutButton: {
    backgroundColor: '#F5F5F5',
    height: 50,
    width: '85%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B03D4E', // Admin color theme
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 50,
    alignSelf: 'center',
  },
  logoutText: {color: '#B03D4E', fontSize: 20, fontWeight: '700'}, // Admin color theme
  note: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
});

export default AdminProfile;