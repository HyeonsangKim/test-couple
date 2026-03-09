// PRD v2 Design System Tokens

export const colors = {
  // Base
  bg: {
    canvas: '#F6F4EF',
    subtle: '#F2EFE9',
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#FBFAF7',
    tertiary: '#F4F1EB',
  },
  // Text
  text: {
    primary: '#111111',
    secondary: '#5F6368',
    tertiary: '#8B9096',
    inverse: '#FFFFFF',
  },
  // Border
  border: {
    soft: 'rgba(17, 17, 17, 0.06)',
    strong: 'rgba(17, 17, 17, 0.12)',
    glass: 'rgba(255, 255, 255, 0.45)',
  },
  // Accent
  accent: {
    primary: '#111111',
    secondary: '#E9E2D5',
    success: '#1F8F5F',
    warning: '#C9871A',
    danger: '#D64545',
  },
  // Glass / Overlay
  glass: {
    fill: 'rgba(255, 255, 255, 0.62)',
    fillStrong: 'rgba(255, 255, 255, 0.78)',
    shadow: 'rgba(17, 17, 17, 0.08)',
  },
  overlay: {
    dim: 'rgba(17, 17, 17, 0.18)',
  },
  // Marker colors
  marker: {
    wishlist: '#C9871A',
    visited: '#1F8F5F',
    orphan: '#8B9096',
  },
  // Category colors
  category: {
    food: '#E67E22',
    travel: '#3498DB',
    activity: '#F1C40F',
    special: '#9B59B6',
    uncategorized: '#8B9096',
  },
  // Status
  status: {
    deleteRequest: '#D64545',
    deleteBg: 'rgba(214, 69, 69, 0.08)',
  },
  // Semantic
  white: '#FFFFFF',
  black: '#000000',
};

export const typography = {
  display: {
    l: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
  },
  heading: {
    l: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
    m: { fontSize: 20, lineHeight: 28, fontWeight: '700' as const },
  },
  title: {
    l: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
    m: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  },
  body: {
    l: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
    m: { fontSize: 14, lineHeight: 22, fontWeight: '400' as const },
    s: { fontSize: 13, lineHeight: 20, fontWeight: '400' as const },
  },
  caption: { fontSize: 12, lineHeight: 18, fontWeight: '500' as const },
  button: {
    l: { fontSize: 16, lineHeight: 16, fontWeight: '600' as const },
    m: { fontSize: 14, lineHeight: 14, fontWeight: '600' as const },
  },
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
};

export const layout = {
  screenPaddingH: 20,
  cardPaddingInner: 16,
  sectionGap: 24,
  cardGap: 12,
  inlineGap: 8,
};

export const radius = {
  xs: 10,
  sm: 14,
  md: 18,
  lg: 24,
  xl: 28,
  pill: 9999,
};

export const shadow = {
  sm: {
    shadowColor: '#111111',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  md: {
    shadowColor: '#111111',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  lg: {
    shadowColor: '#111111',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.10,
    shadowRadius: 40,
    elevation: 8,
  },
};

export const glass = {
  blur: 16,
  blurStrong: 24,
  saturation: 1.1,
  border: {
    width: 1,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  fill: 'rgba(255, 255, 255, 0.62)',
  fillStrong: 'rgba(255, 255, 255, 0.78)',
  // Fallback for non-blur environments
  fallback: {
    background: 'rgba(255, 255, 255, 0.92)',
    borderColor: 'rgba(17, 17, 17, 0.06)',
  },
};
