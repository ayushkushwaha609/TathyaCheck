// TathyaCheck Design System — Indigo to Saffron spectrum

export const lightColors = {
  // Primary spectrum
  deepIndigo: '#1a1147',
  navyBlue: '#0f1d3d',
  deepTeal: '#1a4a4a',
  saffron: '#e87c3e',
  warmOrange: '#f4a261',

  // Gradient
  gradientStart: '#faf5ef',
  gradientEnd: '#ede1d1',

  // Surfaces
  background: '#faf5ef',
  card: '#ffffff',
  cardBorder: '#e8ddd0',
  inputBg: '#ffffff',
  divider: '#ede6da',
  sandstone: '#e8ddd0',

  // Verdict states
  verified: '#2d7a4f',
  verifiedBg: '#eaf5ef',
  false: '#c75b39',
  falseBg: '#fdf0ec',
  turmeric: '#d4a03c',
  turmericBg: '#fdf8ec',
  partialBg: '#eaf3f3',
  lotusRose: '#d4717a',

  // Text
  textPrimary: '#2a2a2a',
  textSecondary: '#6b6b6b',
  textTertiary: '#9a9a9a',
  textOnDark: '#ffffff',

  // Overlays
  overlay: 'rgba(26, 17, 71, 0.92)',
  modalOverlay: 'rgba(0, 0, 0, 0.4)',

  // Status bar
  statusBar: 'dark' as const,
};

export const darkColors = {
  // Primary spectrum
  deepIndigo: '#c4b5fd',
  navyBlue: '#a5b4fc',
  deepTeal: '#5eead4',
  saffron: '#e87c3e',
  warmOrange: '#f4a261',

  // Gradient
  gradientStart: '#0f0a2e',
  gradientEnd: '#1a1147',

  // Surfaces
  background: '#0f0a2e',
  card: '#1e1754',
  cardBorder: '#2d2570',
  inputBg: '#1e1754',
  divider: '#2d2570',
  sandstone: '#2d2570',

  // Verdict states
  verified: '#4ade80',
  verifiedBg: '#0f2a1a',
  false: '#f87171',
  falseBg: '#2a0f0f',
  turmeric: '#fbbf24',
  turmericBg: '#2a2005',
  partialBg: '#0f2a2a',
  lotusRose: '#fb7185',

  // Text
  textPrimary: '#f0edf8',
  textSecondary: '#a8a0c0',
  textTertiary: '#7a7296',
  textOnDark: '#ffffff',

  // Overlays
  overlay: 'rgba(15, 10, 46, 0.95)',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',

  // Status bar
  statusBar: 'light' as const,
};

export type ThemeColors = typeof lightColors;

// Convenience alias — components import `colors` for backward compat
// but useThemeStore provides the live theme
export const colors = lightColors;
