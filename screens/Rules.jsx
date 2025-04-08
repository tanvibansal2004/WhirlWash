import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const Rules = ({navigation}) => {
  return (
    <SafeAreaView style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonContainer}
          activeOpacity={0.7}
          onPress={() => {
            // Try different navigation methods to ensure one works
            try {
              navigation.navigate('Main', { screen: 'HomePage' });
            } catch (error) {
              try {
                navigation.navigate('Main');
              } catch (error) {
                console.log('Navigation error:', error);
              }
            }
          }}
        >
          <View style={styles.buttonBackground}>
          <Icon
          name="chevron-back"
          size={30}
          color="black"
          style={{position: 'absolute', left: 20}}
          // onPress={() => navigation.goBack()}
        />
          </View>
        </TouchableOpacity>
        <Text style={styles.heading}>Rules</Text>
      </View>

      <Text
        style={{
          paddingTop: 30,
          paddingLeft: 20,
          color: '#6E6F79',
          fontSize: 16,
          fontWeight: '400',
        }}>
        Rules to be followed:
      </Text>

      <View
        style={{
          backgroundColor: '#F5F5F5',
          height: '70%',
          width: '85%',
          borderRadius: 5,
          marginTop: 30,
          marginLeft: 30,
          padding: 10,
        }}>

        <View style={styles.rulesContainer}>
          <Text style={styles.ruleText}>
            1. Users can use the machine once every 10 days.
          </Text>
          <Text style={styles.ruleText}>
            2. Users have 15 minutes to bring garments and scan the QR code
            after booking.
          </Text>
          <Text style={styles.ruleText}>
            3. A confirmed booking after the scan grants a 4-hour slot for
            laundry use.
          </Text>
          <Text style={styles.ruleText}>
            4. Late users face a 10-day penalty before their next booking.
          </Text>
          <Text style={styles.ruleText}>
            5. Contact the caretaker or admin for slot extensions during
            emergencies like power cuts.
          </Text>
        </View>

        <Image source={require('../assets/rulegirl.png')}
            style={{width:'100%',height:'50%',marginTop:'-20%'}}
        />

      </View>
    </SafeAreaView>
  );
};

export default Rules;

const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    fontWeight: '600',
    color: '#3D4EB0'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    position: 'relative',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    zIndex: 999,
  },
  buttonBackground: {
    width: 70,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#3D4EB0',
    fontWeight: '600',
    fontSize: 16,
  },
  rulesContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
  },
  ruleText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
});