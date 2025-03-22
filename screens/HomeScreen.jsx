// screens/homeScreen.jsx

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Go to Loading Screen"
        onPress={() => navigation.navigate('Loading')}  // Navigate to Loading Screen
      />

      <Button
        title="Go to Home Page"
        onPress={() => navigation.navigate('HomePage')}  // Navigate to Loading Screen
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;