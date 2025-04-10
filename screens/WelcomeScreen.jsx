// import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
// import React, { useEffect } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { useNavigation } from '@react-navigation/native'
// import Icon from 'react-native-vector-icons/AntDesign';
// import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
// import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

// const WelcomeScreen = () => {
//   const navigation = useNavigation();

//   useEffect(() => {
//     // Configure Google Sign-In
//     GoogleSignin.configure({
//       webClientId: '730412495428-nufbau8ufjfrh7igi56sjpg03jqk10nl.apps.googleusercontent.com',
//       offlineAccess: true,
//       forceCodeForRefreshToken: true,
//     });
//   }, []);


//   const googleLogin = async () => {
//     try {
//       //await GoogleSignin.signOut(); // Force sign out before signing in again
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       console.log("user info:", userInfo);

//       // Check if the email ends with "@lnmiit.ac.in"
      
//       const userEmail = userInfo.data.user.email;
//       const { idToken } = userInfo.data;

//       // if (!userEmail.endsWith("@lnmiit.ac.in")) {
//       //   Alert.alert("Access Denied", "Only LNMIIT email addresses are allowed.");
//       //   await GoogleSignin.signOut();
//       //   return;
//       // }

      
//       if (!idToken) {
//         throw new Error("Google Sign-In failed: No ID token received.");
//       }

//       const auth = getAuth();
//       const googleCredential = GoogleAuthProvider.credential(idToken);
//       await signInWithCredential(auth, googleCredential); // 🔥 Links Google to Firebase Auth

//       console.log("✅ User successfully signed in to Firebase Authentication!");

//       // Check if user is admin by querying Firestore
//       const db = firestore();
//       const adminSnapshot = await db.collection('admins')
//         .where('email', '==', userEmail)
//         .get();
//       const isAdmin = !adminSnapshot.empty;


//       // Navigate based on user role
//       if (isAdmin) {
//         console.log("Admin user detected, navigating to AdminMain");
//         navigation.navigate('AdminMain', {
//           screen: 'AdminHomePage',
//           params: { userEmail: userEmail }
//         });
//       } else {
//         console.log("Regular user detected, navigating to Main");
//         console.log(userEmail); //working
//         navigation.navigate('Main', {
//           screen: 'Profile',
//           params: { userEmail: userEmail }
//         });

//       }

//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         console.log("Sign in cancelled", error);
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         console.log("Sign in in progress", error);
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         Alert.alert("Error", "Play services not available");
//         console.log("Play services not available", error);
//       } else {
//         Alert.alert("Error", "Something went wrong with Google Sign-In");
//         console.log("Other error", error);
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', alignItems: 'center', gap: 200, paddingTop: 40 }}>

//       <View>
//         <Text
//           style={{
//             color: 'black',
//             fontWeight: 'bold',
//             fontSize: 32,
//             textAlign: 'center',
//             fontFamily: 'Poppins-Regular',
//           }}
//         >
//           Welcome!
//         </Text>
//       </View>

//       <View style={{ alignItems: 'center' }}>
//         <Image
//           source={require("../assets/image1.png")}
//           style={{ width: 250, height: 250 }}
//         />
//         <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 8, color: '#3D4EB0', fontWeight: '600' }}>
//           WHIRLWASH
//         </Text>
//       </View>

//       {/* Button at the bottom */}
//       <View style={{ position: 'absolute', width: '80%', bottom: 60 }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: '#3D4EB0',
//             paddingVertical: 12,
//             borderRadius: 10,
//             width: '100%',
//             flexDirection: 'row',  // Align items horizontally
//             justifyContent: 'center',  // Center the contents
//             alignItems: 'center',  // Vertically align
//           }}
//           onPress={googleLogin}
//         >
//           <Icon
//             name="google"
//             size={20}
//             color="white"
//             style={{ marginRight: 5 }}
//           />
//           <Text
//             style={{
//               fontSize: 20,
//               fontWeight: 'bold',
//               textAlign: 'center',
//               color: 'white',
//             }}
//           >
//             Login with Google
//           </Text>
//         </TouchableOpacity>
//       </View>

//     </SafeAreaView>
//   );
// }

// export default WelcomeScreen;

import { Image, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/AntDesign';
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: '730412495428-nufbau8ufjfrh7igi56sjpg03jqk10nl.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    // Set up auth state listener
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User is already signed in:", user.email);
        // User is already signed in, check if admin
        try {
          const userEmail = user.email;
          
          const adminSnapshot = await firestore()
            .collection('admins')
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
            navigation.navigate('Main', {
              screen: 'Profile',
              params: { userEmail: userEmail }
            });
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      } else {
        console.log("No user is signed in");
      }
      
      if (initializing) setInitializing(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigation]);

  const googleLogin = async () => {
    try {
      // Check for Play Services
      await GoogleSignin.hasPlayServices();
      
      // Perform sign in - log the complete response structure
      const userInfo = await GoogleSignin.signIn();
      console.log("COMPLETE USER INFO:", JSON.stringify(userInfo));
      
      // Looking at your original code, you were accessing the token as:
      // const { idToken } = userInfo.data;
      // Let's try to match this structure
      
      let idToken = null;
      
      // Try multiple possible locations for the token
      if (userInfo && userInfo.data && userInfo.data.idToken) {
        // Original pattern in your code
        idToken = userInfo.data.idToken;
        console.log("Found token in userInfo.data.idToken");
      } else if (userInfo && userInfo.idToken) {
        // Standard pattern in newer versions
        idToken = userInfo.idToken;
        console.log("Found token in userInfo.idToken");
      } else if (userInfo && userInfo.user && userInfo.user.idToken) {
        // Another possible location
        idToken = userInfo.user.idToken;
        console.log("Found token in userInfo.user.idToken");
      }
      
      // Log the complete structure to debug
      console.log("UserInfo structure keys:", Object.keys(userInfo));
      if (userInfo.data) {
        console.log("UserInfo.data keys:", Object.keys(userInfo.data));
      }
      
      if (!idToken) {
        console.error("ID Token not found in response");
        throw new Error("Google Sign-In failed: No ID token received. Check console for full response structure.");
      }
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
      console.log("Firebase Auth successful");
      
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Sign in cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Sign in in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Error", "Play services not available");
      } else {
        Alert.alert("Error", "Something went wrong with Google Sign-In: " + (error.message || JSON.stringify(error)));
      }
    }
  };

  if (initializing) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#3D4EB0" />
        <Text style={{ marginTop: 10, color: '#3D4EB0' }}>Checking login status...</Text>
      </SafeAreaView>
    );
  }

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