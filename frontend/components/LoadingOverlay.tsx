import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';

const LOADING_MESSAGES = [
  { text: 'सच ढूंढ रहे हैं...', english: 'Searching for truth...' },
  { text: 'वीडियो सुन रहे हैं...', english: 'Listening to video...' },
  { text: 'विशेषज्ञों से पूछ रहे हैं...', english: 'Consulting experts...' },
  { text: 'तथ्यों की जांच कर रहे हैं...', english: 'Checking the facts...' },
  { text: 'जवाब तैयार कर रहे हैं...', english: 'Preparing answer...' },
];

export const LoadingOverlay: React.FC = () => {
  const { colors } = useThemeStore();
  const [messageIndex, setMessageIndex] = useState(0);
  const spinValue = new Animated.Value(0);
  const pulseValue = new Animated.Value(1);
  const ring1 = new Animated.Value(0.3);
  const ring2 = new Animated.Value(0.2);
  const ring3 = new Animated.Value(0.1);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.15,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const animateRing = (ring: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(ring, { toValue: 0.6, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(ring, { toValue: 0.15, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start();
    };

    animateRing(ring1, 0);
    animateRing(ring2, 300);
    animateRing(ring3, 600);

    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
      <View style={styles.mandalaContainer}>
        <Animated.View style={[styles.ring, styles.ring3, { borderColor: colors.saffron, opacity: ring3 }]} />
        <Animated.View style={[styles.ring, styles.ring2, { borderColor: colors.saffron, opacity: ring2 }]} />
        <Animated.View style={[styles.ring, styles.ring1, { borderColor: colors.saffron, opacity: ring1 }]} />
        <Animated.View style={[styles.iconContainer, { transform: [{ rotate: spin }, { scale: pulseValue }] }]}>
          <View style={[styles.centerDot, { backgroundColor: colors.saffron }]} />
        </Animated.View>
      </View>

      <Text style={styles.hindiText}>{LOADING_MESSAGES[messageIndex].text}</Text>
      <Text style={styles.englishText}>{LOADING_MESSAGES[messageIndex].english}</Text>

      <View style={styles.stepsContainer}>
        {['Extracting', 'Analyzing', 'Verifying'].map((step, i) => (
          <View
            key={step}
            style={[styles.stepBadge, messageIndex >= i * 2 && { backgroundColor: 'rgba(232,124,62,0.2)' }]}
          >
            <Text style={[styles.stepText, messageIndex >= i * 2 && { color: colors.saffron }]}>
              {step}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.timeText}>This usually takes 15-30 seconds</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  mandalaContainer: {
    width: 160, height: 160,
    alignItems: 'center', justifyContent: 'center', marginBottom: 32,
  },
  ring: { position: 'absolute', borderRadius: 999, borderWidth: 1.5 },
  ring1: { width: 80, height: 80 },
  ring2: { width: 120, height: 120 },
  ring3: { width: 152, height: 152, borderStyle: 'dashed' },
  iconContainer: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  centerDot: { width: 14, height: 14, borderRadius: 7 },
  hindiText: { color: '#ffffff', fontSize: 22, fontWeight: '600', marginBottom: 6, textAlign: 'center' },
  englishText: { color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 32, textAlign: 'center' },
  stepsContainer: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  stepBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.06)' },
  stepText: { fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: '500' },
  timeText: { color: 'rgba(255,255,255,0.35)', fontSize: 13 },
});
