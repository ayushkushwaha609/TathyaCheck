import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID_WEB = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || '';
const GOOGLE_CLIENT_ID_ANDROID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || '';

export function GoogleSignInButton() {
  const { isAuthenticated, googleEmail, isAuthLoading, signInWithGoogle, signOut } = useAuthStore();
  const { colors } = useThemeStore();

  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    webClientId: GOOGLE_CLIENT_ID_WEB,
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        signInWithGoogle(idToken);
      }
    }
  }, [response]);

  if (isAuthenticated) {
    return (
      <View style={[styles.signedInContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.userInfo}>
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
          <Text style={[styles.emailText, { color: colors.textPrimary }]} numberOfLines={1}>
            {googleEmail}
          </Text>
        </View>
        <TouchableOpacity onPress={signOut} disabled={isAuthLoading} style={styles.signOutBtn}>
          <Text style={[styles.signOutText, { color: colors.textTertiary }]}>Sign out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      onPress={() => promptAsync()}
      disabled={!request || isAuthLoading}
      activeOpacity={0.8}
    >
      {isAuthLoading ? (
        <ActivityIndicator size="small" color={colors.textPrimary} />
      ) : (
        <>
          <Ionicons name="logo-google" size={18} color="#4285F4" />
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            Sign in for more checks
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signedInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  emailText: {
    fontSize: 13,
    flex: 1,
  },
  signOutBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  signOutText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
