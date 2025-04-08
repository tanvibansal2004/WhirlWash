import { Image, StyleSheet, Text, TouchableOpacity, View, Platform, StatusBar, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Fontisto'
import Icon1 from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

const HomePage = () => {
    const [user, setUser] = useState("User");
    const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user}!</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="bell" size={24} color="#3D4EB0"/>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Rules')}
              style={styles.iconButton}
            >
              <Icon1 name="document-text-outline" size={26} color="#3D4EB0"/>
            </TouchableOpacity>
          </View>
        </View>
        
        <Image 
          source={require('../assets/LNMIIT.png')}
          style={styles.bannerImage}
        />

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to WhirlWash!</Text>
          <Text style={styles.welcomeText}>
            "Laundry made simple. Book machines instantly, verify with OTP, and track your wash cycle—all from your phone. No waiting, no paperwork, just clean clothes effortlessly. Get real-time updates and notifications, so you're always in control of your laundry."
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.bookButton}
          onPress={() => navigation.navigate('Machines')}
        >
          <Image 
            source={require('../assets/image.png')}
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>Book Machine</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomePage

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  scrollView: {
    flex: 1,
    width: '100%'
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600'
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10
  },
  iconButton: {
    backgroundColor: '#E2E5F4',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerImage: {
    width: '85%',
    marginTop: 20,
    marginLeft: 30,
    height: 200,
    borderRadius: 10
  },
  welcomeCard: {
    backgroundColor: '#F5F5F5',
    width: '85%',
    borderRadius: 5,
    marginTop: 30,
    marginLeft: 30,
    padding: 15
  },
  welcomeTitle: {
    fontSize: 25,
    fontWeight: '400',
    color: '#3D4EB0',
    marginBottom: 15
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 5
  },
  bookButton: {
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
    gap: 10
  },
  buttonIcon: {
    width: 30,
    height: 30
  },
  buttonText: {
    color: 'grey',
    fontSize: 20,
    fontWeight: '600'
  }
});