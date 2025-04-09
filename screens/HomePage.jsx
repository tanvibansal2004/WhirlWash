// import {
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Platform,
//   StatusBar,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import React, {useState} from 'react';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Fontisto';
// import Icon1 from 'react-native-vector-icons/Ionicons';
// import {useNavigation} from '@react-navigation/native';

// const windowWidth = Dimensions.get('window').width;

// const HomePage = () => {
//   const [user, setUser] = useState('User');
//   const navigation = useNavigation();

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollViewContent}
//         showsVerticalScrollIndicator={false}>
//         <View style={styles.header}>
//           <Text style={styles.greeting}>Hello, {user}!</Text>
//           <View style={styles.iconContainer}>
//             <TouchableOpacity style={styles.iconButton}>
//               <Icon name="bell" size={24} color="#3D4EB0" />
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => navigation.navigate('Rules')}
//               style={styles.iconButton}>
//               <Icon1 name="document-text-outline" size={26} color="#3D4EB0" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <Image
//           source={require('../assets/LNMIIT.png')}
//           style={styles.bannerImage}
//         />

//         <View style={styles.welcomeCard}>
//           <Text style={styles.welcomeTitle}>Welcome to WhirlWash!</Text>
//           <Text style={styles.welcomeText}>
//             "Laundry made simple. Book machines instantly, verify with OTP, and
//             track your wash cycle—all from your phone. No waiting, no paperwork,
//             just clean clothes effortlessly. Get real-time updates and
//             notifications, so you're always in control of your laundry."
//           </Text>
//         </View>

//         {/* Additional content for scrolling demonstration */}
//         <View style={styles.additionalSection}>
//           <Text style={styles.sectionTitle}>Features</Text>
//           <View style={styles.featureItem}>
//             <Icon1 name="time-outline" size={24} color="#3D4EB0" />
//             <Text style={styles.featureText}>
//               Real-time machine availability
//             </Text>
//           </View>
//           <View style={styles.featureItem}>
//             <Icon1 name="notifications-outline" size={24} color="#3D4EB0" />
//             <Text style={styles.featureText}>
//               Laundry cycle completion alerts
//             </Text>
//           </View>
//           <View style={styles.featureItem}>
//             <Icon1 name="calendar-outline" size={24} color="#3D4EB0" />
//             <Text style={styles.featureText}>Easy scheduling system</Text>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.bookButton}
//           onPress={() => navigation.navigate('Machines')}>
//           <Image
//             source={require('../assets/image.png')}
//             style={styles.buttonIcon}
//           />
//           <Text style={styles.buttonText}>Book Machine</Text>
//         </TouchableOpacity>
//         {/* Bottom padding for better scrolling */}
//         <View style={styles.bottomPadding} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default HomePage;

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: 'white',
//     // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
//   },
//   scrollView: {
//     flex: 1,
//     width: '100%',
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//   },
//   greeting: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   iconButton: {
//     backgroundColor: '#E2E5F4',
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bannerImage: {
//     width: '85%',
//     marginTop: 20,
//     marginLeft: 30,
//     height: 200,
//     borderRadius: 10,
//   },
//   welcomeCard: {
//     backgroundColor: '#F5F5F5',
//     width: '85%',
//     borderRadius: 5,
//     marginTop: 30,
//     marginLeft: 30,
//     padding: 15,
//   },
//   welcomeTitle: {
//     fontSize: 25,
//     fontWeight: '400',
//     color: '#3D4EB0',
//     marginBottom: 15,
//   },
//   welcomeText: {
//     fontSize: 16,
//     lineHeight: 22,
//     marginTop: 5,
//   },
//   bookButton: {
//     backgroundColor: '#F5F5F5',
//     height: 60,
//     width: '85%',
//     marginTop: 20,
//     borderRadius: 10,
//     marginLeft: 30,
//     borderWidth: 2,
//     borderColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//     gap: 10,
//   },
//   buttonIcon: {
//     width: 30,
//     height: 30,
//   },
//   buttonText: {
//     color: 'grey',
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   additionalSection: {
//     backgroundColor: '#F5F5F5',
//     width: windowWidth * 0.85,
//     borderRadius: 10,
//     marginTop: 24,
//     alignSelf: 'center',
//     padding: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 1},
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: '500',
//     color: '#3D4EB0',
//     marginBottom: 16,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//     gap: 12,
//   },
//   featureText: {
//     fontSize: 16,
//     color: '#333',
//     flex: 1,
//   },
//   bottomPadding: {
//     height: 80,
//   },
// });


import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Fontisto';
import Icon1 from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const HomePage = () => {

  const [name, setName] = useState('');

  useEffect(() => {
    const fetchNameByEmail = async () => {
      try {
        const user = auth().currentUser;

        if (!user) {
          console.log("No user signed in");
          return;
        }

        const email = user.email;
        console.log("Signed-in email:", email);

        const querySnapshot = await firestore()
          .collection('students')
          .where('Email', '==', email)
          .get();

        if (!querySnapshot.empty) {
          const studentData = querySnapshot.docs[0].data();
          console.log("Fetched student data:", studentData);
          const fullName = studentData?.Name || '';
          const firstName = fullName.split(' ')[0];
          setName(firstName);
        } else {
          console.log("No student found with email:", email);
        }
      } catch (error) {
        console.error("Error fetching student name:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNameByEmail();
  }, []);

  
  const navigation = useNavigation();


  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      
      <View style={styles.header}>
      <Text style={styles.headerText}>Hello, {name ? name : 'User'}!</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bell" size={24} color="#3D4EB0" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Rules')}
            style={styles.iconButton}>
            <Icon1 name="document-text-outline" size={26} color="#3D4EB0" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always">
        
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/LNMIIT.png')}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Welcome to WhirlWash!</Text>
          <Text style={styles.infoText}>
            Laundry made simple. Book machines instantly, verify with OTP, and
            track your wash cycle—all from your phone. No waiting, no paperwork,
            just clean clothes effortlessly. Our app eliminates queues, sends
            timely notifications, and ensures fair machine allocation. Manage
            your laundry schedule efficiently around your busy day with our
            user-friendly interface.
          </Text>
        </View>
        
        {/* Additional content for scrolling demonstration */}
        <View style={styles.additionalSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Icon1 name="time-outline" size={24} color="#3D4EB0" />
            <Text style={styles.featureText}>Real-time machine availability</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon1 name="notifications-outline" size={24} color="#3D4EB0" />
            <Text style={styles.featureText}>Laundry cycle completion alerts</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon1 name="calendar-outline" size={24} color="#3D4EB0" />
            <Text style={styles.featureText}>Easy scheduling system</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Machines')}
          activeOpacity={0.7}>
          <Image
            source={require('../assets/image.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Book Machine</Text>
        </TouchableOpacity>
        
        {/* Bottom padding for better scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
    zIndex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    backgroundColor: '#E2E5F4',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  mainImage: {
    width: windowWidth * 0.85,
    height: 200,
    borderRadius: 10,
  },
  infoContainer: {
    backgroundColor: '#F5F5F5',
    minHeight: 150,
    width: windowWidth * 0.85,
    borderRadius: 10,
    marginTop: 30,
    alignSelf: 'center',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoTitle: {
    fontSize: 25,
    fontWeight: '500',
    color: '#3D4EB0', // Keep original blue color for user page
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#F5F5F5',
    height: 60,
    width: windowWidth * 0.85,
    marginTop: 24,
    borderRadius: 10,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonIcon: {
    width: 30,
    height: 30,
  },
  buttonText: {
    color: '#555',
    fontSize: 20,
    fontWeight: '600',
  },
  additionalSection: {
    backgroundColor: '#F5F5F5',
    width: windowWidth * 0.85,
    borderRadius: 10,
    marginTop: 24,
    alignSelf: 'center',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#3D4EB0', // Keep original blue color for user page
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  bottomPadding: {
    height: 40,
  },
});