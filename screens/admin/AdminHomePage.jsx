import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const AdminHomePage = () => {
  const [admin, setAdmin] = useState('Admin');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../../assets/LNMIIT.png')}
          style={styles.mainImage}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Welcome to WhirlWash!</Text>
          <Text></Text>
          <Text style={styles.infoText}>
            "Laundry made simple. Book machines instantly, verify with OTP, and
            track your wash cycle—all from your phone. No waiting, no paperwork,
            just clean clothes effortlessly. Our app eliminates queues, sends
            timely notifications, and ensures fair machine allocation. Manage
            your laundry schedule efficiently around your busy day with our
            user-friendly interface."
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Machines')}>
          <Image
            source={require('../../assets/redMachine.png')}
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>View Machines</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHomePage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
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
  scrollContent: {
    paddingBottom: 30,
  },
  mainImage: {
    width: '85%',
    marginTop: 20,
    marginLeft: 30,
    height: 200,
    borderRadius: 10,
  },
  infoContainer: {
    backgroundColor: '#F5F5F5',
    minHeight: 150,
    width: '85%',
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    padding: 10,
  },
  infoTitle: {
    fontSize: 25,
    fontWeight: '400',
    color: '#B03D4E',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 5,
  },
  actionButton: {
    backgroundColor: '#F5F5F5',
    height: 60,
    width: '85%',
    marginTop: 20,
    borderRadius: 10,
    marginLeft: 30,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  buttonIcon: {
    width: 30,
    height: 30,
  },
  buttonText: {
    color: 'grey',
    fontSize: 20,
    fontWeight: '600',
  },
});
