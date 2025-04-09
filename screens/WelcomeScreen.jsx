import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '730412495428-nufbau8ufjfrh7igi56sjpg03jqk10nl.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);


  const googleLogin = async () => {
    try {
      //await GoogleSignin.signOut(); // Force sign out before signing in again
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("user info:", userInfo);

      // Check if the email ends with "@lnmiit.ac.in"
      
      const userEmail = userInfo.data.user.email;
      const { idToken } = userInfo.data;

      // if (!userEmail.endsWith("@lnmiit.ac.in")) {
      //   Alert.alert("Access Denied", "Only LNMIIT email addresses are allowed.");
      //   await GoogleSignin.signOut();
      //   return;
      // }

      
      if (!idToken) {
        throw new Error("Google Sign-In failed: No ID token received.");
      }

      const auth = getAuth();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential); // 🔥 Links Google to Firebase Auth

      console.log("✅ User successfully signed in to Firebase Authentication!");

      // Check if user is admin by querying Firestore
      const db = firestore();
      const adminSnapshot = await db.collection('admins')
        .where('email', '==', userEmail)
        .get();
      const isAdmin = !adminSnapshot.empty;


      // Navigate based on user role
      if (isAdmin) {
        console.log("Admin user detected, navigating to AdminMain");
        navigation.navigate('AdminMain', {
          screen: 'AdminHomePage',
          params: { userEmail: userEmail }
        });
      } else {
        console.log("Regular user detected, navigating to Main");
        console.log(userEmail); //working
        navigation.navigate('Main', {
          screen: 'Profile',
          params: { userEmail: userEmail }
        });

      }

    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Sign in cancelled", error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in in progress", error);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Play services not available");
        console.log("Play services not available", error);
      } else {
        Alert.alert("Error", "Something went wrong with Google Sign-In");
        console.log("Other error", error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', alignItems: 'center', gap: 200, paddingTop: 40 }}>

      <View>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 32,
            textAlign: 'center',
            fontFamily: 'Poppins-Regular',
          }}
        >
          Welcome!
        </Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Image
          source={require("../assets/image1.png")}
          style={{ width: 250, height: 250 }}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8, color: '#3D4EB0', fontWeight: '600' }}>
          WHIRLWASH
        </Text>
      </View>

      {/* Button at the bottom */}
      <View style={{ position: 'absolute', width: '80%', bottom: 60 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#3D4EB0',
            paddingVertical: 12,
            borderRadius: 10,
            width: '100%',
            flexDirection: 'row',  // Align items horizontally
            justifyContent: 'center',  // Center the contents
            alignItems: 'center',  // Vertically align
          }}
          onPress={googleLogin}
        >
          <Icon
            name="google"
            size={20}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'white',
            }}
          >
            Login with Google
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

export default WelcomeScreen;