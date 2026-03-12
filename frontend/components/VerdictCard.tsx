import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CheckResult } from '../store/useCheckStore';
import { useThemeStore } from '../store/useThemeStore';
import { ThemeColors } from '../constants/theme';

interface VerdictCardProps {
  result: CheckResult;
}

const getVerdictConfig = (verdict: string, c: ThemeColors) => {
  switch (verdict) {
    case 'TRUE':
      return {
        color: c.verified,
        bgColor: c.verifiedBg,
        borderColor: c.verified,
        icon: 'checkmark-circle' as const,
        label: 'VERIFIED',
        labelHindi: 'सत्यापित',
      };
    case 'FALSE':
      return {
        color: c.false,
        bgColor: c.falseBg,
        borderColor: c.false,
        icon: 'close-circle' as const,
        label: 'FALSE',
        labelHindi: 'झूठ',
      };
    case 'MISLEADING':
      return {
        color: c.turmeric,
        bgColor: c.turmericBg,
        borderColor: c.turmeric,
        icon: 'warning' as const,
        label: 'MISLEADING',
        labelHindi: 'भ्रामक',
      };
    case 'PARTIALLY_TRUE':
      return {
        color: c.deepTeal,
        bgColor: c.partialBg,
        borderColor: c.deepTeal,
        icon: 'remove-circle' as const,
        label: 'PARTIALLY TRUE',
        labelHindi: 'आंशिक सच',
      };
    default:
      return {
        color: c.textSecondary,
        bgColor: c.card,
        borderColor: c.textSecondary,
        icon: 'help-circle' as const,
        label: 'UNKNOWN',
        labelHindi: 'अज्ञात',
      };
  }
};

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'health': return 'fitness';
    case 'science': return 'flask';
    case 'history': return 'time';
    case 'technology': return 'hardware-chip';
    case 'finance': return 'cash';
    case 'news': return 'newspaper';
    default: return 'information-circle';
  }
};

const BilingualSection = ({
  label, englishText, regionalText, icon, iconColor,
  boxStyle, textStyle, colors: c,
}: {
  label: string; englishText: string; regionalText?: string;
  icon?: string; iconColor?: string; boxStyle?: object; textStyle?: object;
  colors: ThemeColors;
}) => {
  if (!englishText && !regionalText) return null;
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon && <Ionicons name={icon as any} size={16} color={iconColor || c.textSecondary} />}
        <Text style={[styles.sectionLabel, { color: c.textSecondary }, icon ? { marginLeft: 6, marginBottom: 0 } : {}]}>{label}</Text>
      </View>
      <View style={[styles.bilingualBox, { backgroundColor: c.card, borderColor: c.cardBorder }, boxStyle]}>
        {englishText && (
          <View style={styles.languageBlock}>
            <Text style={[styles.languageLabel, { color: c.saffron }]}>English</Text>
            <Text style={[styles.contentText, { color: c.textPrimary }, textStyle]}>{englishText}</Text>
          </View>
        )}
        {regionalText && (
          <View style={[styles.languageBlock, englishText ? [styles.languageBlockBorder, { borderTopColor: c.divider }] : {}]}>
            <Text style={[styles.languageLabel, { color: c.saffron }]}>आपकी भाषा</Text>
            <Text style={[styles.contentText, { color: c.textPrimary }, textStyle]}>{regionalText}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const BilingualKeyPoints = ({
  englishPoints, regionalPoints, colors: c,
}: {
  englishPoints: string[]; regionalPoints?: string[]; colors: ThemeColors;
}) => {
  if (!englishPoints || englishPoints.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>KEY POINTS FROM VIDEO</Text>
      <View style={[styles.keyPointsContainer, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
        <View style={styles.languageBlock}>
          <Text style={[styles.languageLabel, { color: c.saffron }]}>English</Text>
          {englishPoints.map((point, index) => (
            <View key={`en-${index}`} style={styles.keyPointItem}>
              <View style={[styles.bulletPoint, { backgroundColor: c.saffron }]} />
              <Text style={[styles.keyPointText, { color: c.textPrimary }]}>{point}</Text>
            </View>
          ))}
        </View>
        {regionalPoints && regionalPoints.length > 0 && (
          <View style={[styles.languageBlock, styles.languageBlockBorder, { borderTopColor: c.divider }]}>
            <Text style={[styles.languageLabel, { color: c.saffron }]}>आपकी भाषा</Text>
            {regionalPoints.map((point, index) => (
              <View key={`reg-${index}`} style={styles.keyPointItem}>
                <View style={[styles.bulletPoint, { backgroundColor: c.saffron }]} />
                <Text style={[styles.keyPointText, { color: c.textPrimary }]}>{point}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export const VerdictCard: React.FC<VerdictCardProps> = ({ result }) => {
  const { colors: c } = useThemeStore();
  const config = getVerdictConfig(result.verdict, c);

  return (
    <View style={styles.container}>
      {/* Verdict Badge */}
      <View style={[styles.verdictBadge, { backgroundColor: config.bgColor, borderColor: config.borderColor }]}>
        <Ionicons name={config.icon} size={48} color={config.color} />
        <Text style={[styles.verdictText, { color: config.color }]}>{config.label}</Text>
        <Text style={[styles.verdictHindi, { color: config.color }]}>{config.labelHindi}</Text>
        {result.category && (
          <View style={[styles.categoryBadge, { backgroundColor: c.divider }]}>
            <Ionicons name={getCategoryIcon(result.category) as any} size={14} color={c.textSecondary} />
            <Text style={[styles.categoryText, { color: c.textSecondary }]}>{result.category.toUpperCase()}</Text>
          </View>
        )}
      </View>

      <BilingualSection label="CLAIM" englishText={result.claim} regionalText={result.claim_regional} colors={c} />

      {/* Confidence */}
      <View style={styles.confidenceContainer}>
        <Text style={[styles.sectionLabel, { color: c.textSecondary }]}>CONFIDENCE</Text>
        <View style={[styles.confidenceBar, { backgroundColor: c.sandstone }]}>
          <View style={[styles.confidenceFill, { width: `${result.confidence}%`, backgroundColor: config.color }]} />
        </View>
        <Text style={[styles.confidenceText, { color: config.color }]}>{result.confidence}%</Text>
      </View>

      <BilingualSection label="QUICK VERDICT" englishText={result.reason} regionalText={result.reason_regional} colors={c} />
      <BilingualKeyPoints englishPoints={result.key_points} regionalPoints={result.key_points_regional} colors={c} />

      <BilingualSection
        label="THE FACTS" englishText={result.fact_details} regionalText={result.fact_details_regional}
        icon="book" iconColor={c.verified}
        boxStyle={{ backgroundColor: c.verifiedBg, borderLeftWidth: 4, borderLeftColor: c.verified, borderColor: c.verified }}
        colors={c}
      />
      <BilingualSection
        label="WHAT YOU SHOULD KNOW" englishText={result.what_to_know} regionalText={result.what_to_know_regional}
        icon="bulb" iconColor={c.turmeric}
        boxStyle={{ backgroundColor: c.turmericBg, borderLeftWidth: 4, borderLeftColor: c.turmeric, borderColor: c.turmeric }}
        colors={c}
      />

      {result.sources_note && (
        <View style={[styles.sourcesContainer, { backgroundColor: c.card, borderColor: c.cardBorder }]}>
          <Ionicons name="library" size={14} color={c.textSecondary} />
          <Text style={[styles.sourcesText, { color: c.textSecondary }]}>{result.sources_note}</Text>
        </View>
      )}

      {(result.why_misleading || result.why_misleading_regional) && (
        <BilingualSection
          label="WHY IS THIS MISLEADING?" englishText={result.why_misleading} regionalText={result.why_misleading_regional}
          icon="alert-circle" iconColor={c.false}
          boxStyle={{ backgroundColor: c.falseBg, borderLeftWidth: 4, borderLeftColor: c.false, borderColor: c.false }}
          colors={c}
        />
      )}

      {result.verdict_text_english && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language" size={16} color={c.deepTeal} />
            <Text style={[styles.sectionLabel, { color: c.textSecondary, marginLeft: 6, marginBottom: 0 }]}>DETAILED ANALYSIS (ENGLISH)</Text>
          </View>
          <View style={[styles.verdictTextBox, { backgroundColor: c.card, borderColor: c.cardBorder, borderLeftColor: config.color }]}>
            <Text style={[styles.verdictSpeechText, { color: c.textPrimary }]}>{result.verdict_text_english}</Text>
          </View>
        </View>
      )}

      {result.verdict_text_regional && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="volume-high" size={16} color={c.saffron} />
            <Text style={[styles.sectionLabel, { color: c.textSecondary, marginLeft: 6, marginBottom: 0 }]}>DETAILED ANALYSIS (आपकी भाषा)</Text>
          </View>
          <View style={[styles.verdictTextBox, { backgroundColor: c.card, borderColor: c.cardBorder, borderLeftColor: config.color }]}>
            <Text style={[styles.verdictSpeechText, { color: c.textPrimary }]}>{result.verdict_text_regional}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  verdictBadge: {
    alignItems: 'center', justifyContent: 'center',
    padding: 24, borderRadius: 16, marginBottom: 24, borderWidth: 2,
  },
  verdictText: { fontSize: 24, fontWeight: 'bold', marginTop: 8, letterSpacing: 2 },
  verdictHindi: { fontSize: 16, fontWeight: '500', marginTop: 2 },
  categoryBadge: {
    flexDirection: 'row', alignItems: 'center', marginTop: 12,
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, gap: 4,
  },
  categoryText: { fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 8 },
  bilingualBox: { borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
  languageBlock: { padding: 12 },
  languageBlockBorder: { borderTopWidth: 1 },
  languageLabel: { fontSize: 11, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  contentText: { fontSize: 15, lineHeight: 22 },
  confidenceContainer: { marginBottom: 20 },
  confidenceBar: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  confidenceFill: { height: '100%', borderRadius: 4 },
  confidenceText: { fontSize: 16, fontWeight: '600' },
  keyPointsContainer: { borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
  keyPointItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bulletPoint: { width: 6, height: 6, borderRadius: 3, marginTop: 7, marginRight: 10 },
  keyPointText: { fontSize: 14, lineHeight: 20, flex: 1 },
  sourcesContainer: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 8, padding: 12, marginBottom: 20, gap: 8, borderWidth: 1,
  },
  sourcesText: { fontSize: 13, fontStyle: 'italic', flex: 1 },
  verdictTextBox: { borderRadius: 12, padding: 16, borderLeftWidth: 4, borderWidth: 1 },
  verdictSpeechText: { fontSize: 15, lineHeight: 24 },
});
