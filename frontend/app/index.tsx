import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useShareIntentContext } from 'expo-share-intent';
import { useCheckStore } from '../store/useCheckStore';
import { useThemeStore } from '../store/useThemeStore';
import { LanguagePicker } from '../components/LanguagePicker';
import { LoadingOverlay } from '../components/LoadingOverlay';

function extractUrl(text: string): string {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : text.trim();
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useThemeStore();
  const {
    url,
    setUrl,
    languageCode,
    setLanguageCode,
    isLoading,
    error,
    runCheck,
  } = useCheckStore();

  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();
  const isProcessingShareRef = useRef(false);

  useEffect(() => {
    const handleShareIntent = async () => {
      if (!hasShareIntent || isProcessingShareRef.current) return;

      const sharedText = shareIntent?.webUrl || shareIntent?.text || '';
      if (!sharedText) {
        resetShareIntent();
        return;
      }

      const cleanUrl = extractUrl(sharedText);

      if (cleanUrl && /(instagram\.com|instagr\.am|youtube\.com|youtu\.be)/i.test(cleanUrl)) {
        isProcessingShareRef.current = true;
        useCheckStore.setState({ result: null, error: null, isLoading: false });
        setUrl(cleanUrl);
        resetShareIntent();

        const success = await useCheckStore.getState().runCheck(cleanUrl);
        if (success) {
          router.push('/result');
        }
        isProcessingShareRef.current = false;
      } else {
        resetShareIntent();
      }
    };

    handleShareIntent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasShareIntent]);

  const handleCheck = async () => {
    Keyboard.dismiss();
    const success = await runCheck();
    if (success) {
      router.push('/result');
    }
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Theme Toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.themeToggle, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                onPress={toggleTheme}
              >
                <Ionicons
                  name={isDark ? 'sunny' : 'moon'}
                  size={18}
                  color={colors.saffron}
                />
              </TouchableOpacity>
            </View>

            {/* Header with Logo */}
            <View style={styles.header}>
              <Image
                source={require('../assets/images/logo.png')}
                style={[styles.logo, isDark && { tintColor: '#ffffff' }]}
                resizeMode="contain"
              />
              <Text style={[styles.taglineHindi, { color: colors.saffron }]}>
                तथ्य की जांच
              </Text>
              <Text style={[styles.tagline, { color: colors.textTertiary }]}>
                Share a reel. Hear the truth.
              </Text>
            </View>

            {/* Input Section */}
            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                Paste Video Link
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.cardBorder }]}>
                <Ionicons
                  name="link"
                  size={20}
                  color={colors.textTertiary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="Instagram or YouTube link"
                  placeholderTextColor={colors.textTertiary}
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />
                {url.length > 0 && (
                  <TouchableOpacity onPress={() => setUrl('')}>
                    <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
                  </TouchableOpacity>
                )}
              </View>

              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={colors.false} />
                  <Text style={[styles.errorText, { color: colors.false }]}>{error}</Text>
                </View>
              )}

              <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                Select Language
              </Text>
              <LanguagePicker
                selectedValue={languageCode}
                onValueChange={setLanguageCode}
              />

              {/* Check Button with gradient */}
              <TouchableOpacity
                onPress={handleCheck}
                disabled={!url || isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={(!url || isLoading)
                    ? [colors.sandstone, colors.sandstone]
                    : [colors.deepIndigo as string, colors.deepTeal as string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.checkButton}
                >
                  <Text style={styles.checkButtonText}>Check</Text>
                  <Text style={[styles.checkButtonHindi, { color: colors.warmOrange }]}>
                    जांचें
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.infoContainer}>
                <Ionicons name="information-circle" size={16} color={colors.textTertiary} />
                <Text style={[styles.infoText, { color: colors.textTertiary }]}>
                  Works with public reels only
                </Text>
              </View>
            </View>

            {/* Supported Platforms */}
            <View style={styles.platformsContainer}>
              <Text style={[styles.platformsLabel, { color: colors.textTertiary }]}>
                Supported Platforms
              </Text>
              <View style={styles.platformsRow}>
                <View style={[styles.platformBadge, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                  <Text style={[styles.platformText, { color: colors.textPrimary }]}>Instagram</Text>
                </View>
                <View style={[styles.platformBadge, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                  <Text style={[styles.platformText, { color: colors.textPrimary }]}>YouTube</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {isLoading && <LoadingOverlay />}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  toggleRow: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 8,
  },
  taglineHindi: {
    fontSize: 16,
    fontWeight: '500',
  },
  tagline: {
    fontSize: 14,
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 14,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    gap: 8,
  },
  checkButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkButtonHindi: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  infoText: {
    fontSize: 14,
  },
  platformsContainer: {
    alignItems: 'center',
  },
  platformsLabel: {
    fontSize: 12,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  platformsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
  },
  platformText: {
    fontSize: 14,
  },
});
