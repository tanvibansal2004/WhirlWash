// import {
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
// } from 'react-native';
// import React, {useState} from 'react';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Ionicons';
// import Icon1 from 'react-native-vector-icons/Ionicons';
// import {useNavigation} from '@react-navigation/native';

// const AdminHomePage = () => {
//   const [admin, setAdmin] = useState('Admin');
//   const navigation = useNavigation();

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Hello, {admin}!</Text>
//         <View style={styles.iconContainer}>
//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate('AdminProfile');
//             }}
//             style={styles.iconButton}>
//             <Icon name="person" size={24} color="#B03D4E" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}>
//         <Image
//           source={require('../../assets/LNMIIT.png')}
//           style={styles.mainImage}
//         />

//         <View style={styles.infoContainer}>
//           <Text style={styles.infoTitle}>Welcome to WhirlWash!</Text>
//           <Text></Text>
//           <Text style={styles.infoText}>
//             "Laundry made simple. Book machines instantly, verify with OTP, and
//             track your wash cycle—all from your phone. No waiting, no paperwork,
//             just clean clothes effortlessly. Our app eliminates queues, sends
//             timely notifications, and ensures fair machine allocation. Manage
//             your laundry schedule efficiently around your busy day with our
//             user-friendly interface."
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={styles.actionButton}
//           onPress={() => navigation.navigate('Machines')}>
//           <Image
//             source={require('../../assets/redMachine.png')}
//             style={styles.buttonIcon}
//           />
//           <Text style={styles.buttonText}>View Machines</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AdminHomePage;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: 'white',
//     width: '100%',
//     height: '100%',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   iconButton: {
//     backgroundColor: '#F8E9EC',
//     width: 40,
//     height: 40,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollContent: {
//     paddingBottom: 30,
//   },
//   mainImage: {
//     width: '85%',
//     marginTop: 20,
//     marginLeft: 30,
//     height: 200,
//     borderRadius: 10,
//   },
//   infoContainer: {
//     backgroundColor: '#F5F5F5',
//     minHeight: 150,
//     width: '85%',
//     borderRadius: 5,
//     marginTop: 30,
//     marginLeft: 30,
//     padding: 10,
//   },
//   infoTitle: {
//     fontSize: 25,
//     fontWeight: '400',
//     color: '#B03D4E',
//     marginBottom: 15,
//   },
//   infoText: {
//     fontSize: 16,
//     lineHeight: 22,
//     marginTop: 5,
//   },
//   actionButton: {
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
// });


import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StatusBar,
  Platform,
  Dimensions
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const AdminHomePage = () => {
  const [admin, setAdmin] = useState('Admin');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Hello, {admin}!</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AdminProfile');
            }}
            style={styles.iconButton}>
            <Icon name="person" size={24} color="#B03D4E" />
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
            source={require('../../assets/LNMIIT.png')}
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

        {/* <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Machines')}
          activeOpacity={0.7}>
          <Image
            source={require('../../assets/redMachine.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>View Machines</Text>
        </TouchableOpacity> */}
        
        {/* Additional content for scrolling demonstration */}
        <View style={styles.additionalSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureItem}>
            <Icon name="time-outline" size={24} color="#B03D4E" />
            <Text style={styles.featureText}>Real-time machine availability</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="notifications-outline" size={24} color="#B03D4E" />
            <Text style={styles.featureText}>Laundry cycle completion alerts</Text>
          </View>
          <View style={styles.featureItem}>
            <Icon name="calendar-outline" size={24} color="#B03D4E" />
            <Text style={styles.featureText}>Easy scheduling system</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AdminEntries')}
          activeOpacity={0.7}>
          <Icon name="people-outline" size={24} color="#B03D4E" />
          <Text style={styles.buttonText}>Manage Students</Text>
        </TouchableOpacity>
        
        {/* Bottom padding for better scrolling */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHomePage;

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
    backgroundColor: '#F8E9EC',
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
    color: '#B03D4E',
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
    color: '#B03D4E',
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