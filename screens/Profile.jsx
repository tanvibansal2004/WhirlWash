import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
  Platform,
  SafeAreaView
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

const Profile = ({route, navigation}) => {
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

  // ✅ Get the user's email from Firebase Auth or Google Sign-In if missing
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
      console.error('Error fetching user email:', error);
      Alert.alert('Error', 'Failed to retrieve user email.');
      setLoading(false);
    }
  };

  // ✅ Fetch user data from Firestore using Modular SDK
  const fetchUserData = async email => {
    try {
      setLoading(true);

      if (!email) {
        throw new Error('User email is required to fetch data');
      }

      const q = query(collection(db, 'students'), where('Email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'User not found in database');
        setLoading(false);
        return;
      }

      // Extract first document
      const userDoc = querySnapshot.docs[0];
      setUserData(userDoc.data());
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.warn("No user currently signed in.");
        Alert.alert("Logout", "No user is currently signed in.");
        return;
      }

      await auth.signOut(); // Firebase Auth Logout
      await GoogleSignin.signOut(); // Google Sign-In Logout

      // Reset navigation stack to prevent going back after logout
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3D4EB0" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>User data not found</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserEmail}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Profile</Text>

        <Image source={require('../assets/user.png')} style={styles.img} />
        <Text style={styles.name}>{userData.Name}</Text>

        <View style={styles.detailsContainer}>
          <ProfileDetail label="Roll No." value={userData.RollNo} />
          <ProfileDetail label="Email" value={userData.Email} />
          <ProfileDetail label="Mobile No." value={userData.MobileNo} />
          <ProfileDetail label="Role" value={userData.Role} />
          <ProfileDetail label="Room No." value={userData.RoomNo} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color="#3D4EB0" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          *If any of the above values are incorrect, contact the admin (caretaker)
          for updates.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileDetail = ({label, value}) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || 'Not specified'}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 90, // Extra padding at bottom for better scrolling
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
    backgroundColor: '#3D4EB0',
    borderRadius: 8,
  },
  retryText: {color: 'white', fontSize: 16, fontWeight: '600'},
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  detailLabel: {fontSize: 16, fontWeight: '600', color: '#555'},
  detailValue: {
    fontSize: 16, 
    fontWeight: '400',
    maxWidth: '60%', // Ensure long text doesn't overflow
    textAlign: 'right',
  },
  logoutButton: {
    backgroundColor: '#F5F5F5',
    height: 50,
    width: '85%',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 50,
    alignSelf: 'center',
  },
  logoutText: {color: 'grey', fontSize: 20, fontWeight: '700'},
  note: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
});

export default Profile;