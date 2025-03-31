// screens/loadingScreen.jsx

import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';

const LoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Video
        source={require('../assets/loading.mp4')}  // Path to your loading.mp4 video
        style={styles.video}
        repeat={true}  // Loop the video
        resizeMode="cover"  // Adjust video size to cover the screen
        muted={true}  // Mute the video
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  video: {
    width: 300,  // Set width of the video
    height: 300, // Set height of the video
  },
});

export default LoadingScreen;