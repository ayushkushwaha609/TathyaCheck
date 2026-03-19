import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://tathya-api.onrender.com';
const API_KEY = process.env.EXPO_PUBLIC_API_KEY || '';

interface HistoryItem {
  url_checked: string;
  platform: 'youtube' | 'instagram';
  timestamp: string;
  claim: string;
  verdict: 'TRUE' | 'FALSE' | 'MISLEADING' | 'PARTIALLY_TRUE';
  confidence: number;
}

function getTruthScore(verdict: string, confidence: number): number {
  switch (verdict) {
    case 'TRUE':          return confidence;
    case 'FALSE':         return 100 - confidence;
    case 'MISLEADING':    return Math.round((100 - confidence) * 0.6);
    case 'PARTIALLY_TRUE': return 50;
    default:              return 50;
  }
}

function getVerdictColor(verdict: string, c: any) {
  switch (verdict) {
    case 'TRUE':          return { color: c.verified, bg: c.verifiedBg };
    case 'FALSE':         return { color: c.false, bg: c.falseBg };
    case 'MISLEADING':    return { color: c.turmeric, bg: c.turmericBg };
    case 'PARTIALLY_TRUE': return { color: c.deepTeal, bg: c.partialBg };
    default:              return { color: c.textSecondary, bg: c.card };
  }
}

function getVerdictLabel(verdict: string): string {
  switch (verdict) {
    case 'TRUE':          return 'TRUE';
    case 'FALSE':         return 'FALSE';
    case 'MISLEADING':    return 'MISLEADING';
    case 'PARTIALLY_TRUE': return 'PARTIALLY TRUE';
    default:              return 'UNKNOWN';
  }
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffH / 24);

  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return 'Yesterday';
  if (diffD < 7) return `${diffD} days ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function HistoryScreen() {
  const router = useRouter();
  const { colors: c, isDark } = useThemeStore();
  const { deviceId, isAuthenticated, googleEmail } = useAuthStore();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!deviceId) return;
      try {
        const response = await axios.get(`${API_URL}/api/history`, {
          headers: {
            'X-Device-Id': deviceId,
            ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
          },
        });
        setItems(response.data.history || []);
      } catch {
        setError('Could not load history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [deviceId]);

  return (
    <LinearGradient colors={[c.gradientStart, c.gradientEnd]} style={styles.gradient}>
      <View style={[styles.blob1, { backgroundColor: isDark ? 'rgba(196,181,253,0.08)' : 'rgba(45,27,105,0.06)' }]} />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: c.cardBorder }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={c.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: c.textPrimary }]}>My History</Text>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Sign-in nudge for anonymous users */}
          {!isAuthenticated && (
            <View style={[styles.nudge, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
              <Ionicons name="information-circle-outline" size={16} color={c.saffron} />
              <Text style={[styles.nudgeText, { color: c.textSecondary }]}>
                Sign in to save history across devices
              </Text>
            </View>
          )}

          {loading && (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={c.saffron} />
            </View>
          )}

          {!loading && error && (
            <View style={styles.center}>
              <Ionicons name="alert-circle-outline" size={40} color={c.false} />
              <Text style={[styles.emptyText, { color: c.textSecondary }]}>{error}</Text>
            </View>
          )}

          {!loading && !error && items.length === 0 && (
            <View style={styles.center}>
              <Ionicons name="time-outline" size={48} color={c.textTertiary} />
              <Text style={[styles.emptyText, { color: c.textSecondary }]}>No checks yet</Text>
              <Text style={[styles.emptySubtext, { color: c.textTertiary }]}>Your fact-checks will appear here</Text>
            </View>
          )}

          {!loading && !error && items.map((item, index) => {
            const score = getTruthScore(item.verdict, item.confidence);
            const { color, bg } = getVerdictColor(item.verdict, c);
            const barColor = score >= 70 ? c.verified : score >= 40 ? c.turmeric : c.false;

            return (
              <View key={index} style={[styles.card, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
                {/* Platform + Time */}
                <View style={styles.cardMeta}>
                  <View style={styles.platformRow}>
                    <Ionicons
                      name={item.platform === 'youtube' ? 'logo-youtube' : 'logo-instagram'}
                      size={14}
                      color={item.platform === 'youtube' ? '#FF0000' : '#E1306C'}
                    />
                    <Text style={[styles.platformText, { color: c.textTertiary }]}>
                      {item.platform === 'youtube' ? 'YouTube' : 'Instagram'}
                    </Text>
                  </View>
                  <Text style={[styles.timeText, { color: c.textTertiary }]}>
                    {formatTimestamp(item.timestamp)}
                  </Text>
                </View>

                {/* Claim */}
                <Text style={[styles.claimText, { color: c.textPrimary }]} numberOfLines={2}>
                  "{item.claim}"
                </Text>

                {/* Verdict + Score Bar */}
                <View style={styles.verdictRow}>
                  <View style={[styles.verdictBadge, { backgroundColor: bg }]}>
                    <Text style={[styles.verdictLabel, { color }]}>{getVerdictLabel(item.verdict)}</Text>
                  </View>
                  <View style={styles.scoreSection}>
                    <View style={[styles.scoreBar, { backgroundColor: c.sandstone }]}>
                      <View style={[styles.scoreFill, { width: `${score}%`, backgroundColor: barColor }]} />
                    </View>
                    <Text style={[styles.scoreNum, { color: barColor }]}>{score}%</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  blob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, top: -30, right: -50 },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerPlaceholder: { width: 40 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  nudge: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 16 },
  nudgeText: { fontSize: 13, flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: 16, fontWeight: '500' },
  emptySubtext: { fontSize: 14 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  platformRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  platformText: { fontSize: 12, fontWeight: '500' },
  timeText: { fontSize: 12 },
  claimText: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  verdictRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  verdictBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  verdictLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  scoreSection: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreBar: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  scoreFill: { height: '100%', borderRadius: 3 },
  scoreNum: { fontSize: 12, fontWeight: '600', minWidth: 32 },
});
