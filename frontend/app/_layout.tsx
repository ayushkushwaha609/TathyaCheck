import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { useCheckStore } from '../store/useCheckStore';

// Helper to extract URL from shared text
const extractUrlFromText = (text: string): string | null => {
  const urlPattern = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlPattern);
  if (matches && matches.length > 0) {
    // Find Instagram or YouTube URL
    for (const url of matches) {
      if (url.includes('instagram.com') || url.includes('youtube.com') || url.includes('youtu.be')) {
        return url;
      }
    }
    return matches[0]; // Return first URL if no social media URL found
  }
  return null;
};

export default function RootLayout() {
  const setUrl = useCheckStore((state) => state.setUrl);

  useEffect(() => {
    // Handle URL when app is opened via deep link
    const handleDeepLink = (event: { url: string }) => {
      console.log('Deep link received:', event.url);
      
      let urlToSet: string | null = null;
      
      // Check if it's a direct Instagram/YouTube URL
      if (event.url.includes('instagram.com') || event.url.includes('youtube.com') || event.url.includes('youtu.be')) {
        urlToSet = event.url;
      } else {
        // Try to extract URL from the shared content
        urlToSet = extractUrlFromText(event.url);
      }
      
      if (urlToSet) {
        console.log('Setting URL:', urlToSet);
        setUrl(urlToSet);
      }
    };

    // Get initial URL if app was opened via deep link
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('Initial URL:', initialUrl);
        handleDeepLink({ url: initialUrl });
      }
    };

    getInitialURL();

    // Listen for incoming links while app is open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [setUrl]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F172A' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="result" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
