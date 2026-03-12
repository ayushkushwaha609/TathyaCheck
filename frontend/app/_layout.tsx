import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { ShareIntentProvider, useShareIntentContext } from 'expo-share-intent';
import { useThemeStore } from '../store/useThemeStore';

function ShareIntentHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { hasShareIntent } = useShareIntentContext();
  const processingRef = React.useRef(false);

  useEffect(() => {
    if (hasShareIntent && !processingRef.current) {
      const currentScreen = segments[0] || 'index';
      if (currentScreen === 'result') {
        processingRef.current = true;
        router.replace('/');
        setTimeout(() => {
          processingRef.current = false;
        }, 500);
      }
    }
  }, [hasShareIntent, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  const { colors } = useThemeStore();

  return (
    <ShareIntentProvider>
      <ShareIntentHandler>
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <StatusBar style={colors.statusBar} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="result" />
          </Stack>
        </View>
      </ShareIntentHandler>
    </ShareIntentProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
