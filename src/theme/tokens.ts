// Design System — 0311 Redesign
// White-base, clean, information-focused couple map app

export const colors = {
  bg: {
    // New tokens
    base: '#FFFFFF',
    subtle: '#F7F8FA',
    muted: '#F3F4F6',
    sheet: '#FFFFFF',
    dangerSoft: '#FFF4F4',
    // Backward compat aliases
    canvas: '#FFFFFF',
    elevated: '#FFFFFF',
    soft: '#F7F8FA',
    strong: '#231F26',
  },
  overlay: {
    dim: 'rgba(17,14,19,0.40)',
  },
  text: {
    primary: '#111111',
    secondary: '#5F636B',
    tertiary: '#8B9098',
    inverse: '#FFFFFF',
  },
  line: {
    default: '#ECEEF2',
    strong: '#D9DDE3',
  },
  border: {
    soft: '#ECEEF2',
    strong: '#D9DDE3',
  },
  glass: {
    fill: 'rgba(255,255,255,0.92)',
    fillStrong: '#FFFFFF',
    stroke: 'rgba(0,0,0,0.08)',
  },
  accent: {
    primary: '#FF5C8A',
    primaryPressed: '#F04377',
    primarySoft: '#FFF0F5',
    pressed: '#F04377',
    soft: '#FFF0F5',
    mint: '#18B26B',
    amber: '#F59E0B',
    warning: '#F59E0B',
    info: '#4E8FD6',
    danger: '#E5484D',
  },
  gradient: {
    blushStart: '#FFD6E4',
    blushEnd: '#FFAECF',
  },
  marker: {
    wishlist: '#F59E0B',
    visited: '#18B26B',
    orphan: '#8B9098',
  },
  category: {
    food: '#E67E22',
    travel: '#3498DB',
    activity: '#E0A800',
    special: '#9B59B6',
    uncategorized: '#8B9098',
  },
  status: {
    deleteRequest: '#E5484D',
    deleteBg: 'rgba(229,72,77,0.08)',
  },
  white: '#FFFFFF',
  black: '#000000',
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
};

export const radius = {
  xs: 6,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  sheet: 20,
  full: 999,
};

export const typography = {
  display: {
    l: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
    m: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
  },
  heading: {
    l: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
    m: { fontSize: 20, lineHeight: 28, fontWeight: '700' as const },
  },
  title: {
    l: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
    m: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  },
  body: {
    l: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
    m: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
    s: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  micro: { fontSize: 11, lineHeight: 14, fontWeight: '500' as const },
  button: {
    l: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
    m: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
  },
};

export const shadow = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8,
  },
  glass: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};

export const glass = {
  blur: 0,
  blurStrong: 0,
  saturation: 1,
  border: {
    width: 1,
    color: colors.line.default,
  },
  fill: colors.white,
  fillStrong: colors.white,
  fallback: {
    background: colors.white,
    borderColor: colors.line.default,
  },
};

export const motion = {
  fast: 120,
  normal: 180,
  emphasis: 260,
  sheet: 280,
  page: 240,
  breathe: 1400,
};

export const layout = {
  screenPaddingH: 16,
  formPaddingH: 16,
  sectionGap: 20,
  cardGap: 12,
  headerToContent: 12,
  cardPaddingInner: 16,
  inlineGap: 8,
};

export const component = {
  header: {
    height: 56,
    horizontalPadding: 16,
    iconButton: 44,
  },
  searchBar: {
    height: 48,
    radius: 12,
    icon: 18,
    horizontalPadding: 14,
  },
  input: {
    height: 48,
    heightLarge: 56,
    radius: 12,
    horizontalPadding: 14,
    verticalPadding: 14,
  },
  textarea: {
    minHeight: 120,
    maxHeight: 180,
    composerMinHeight: 48,
    composerMaxHeight: 108,
    radius: 12,
  },
  chip: {
    height: 36,
    radius: 18,
  },
  segmentedControl: {
    height: 48,
    thumbHeight: 40,
    radius: 24,
  },
  settingsRow: {
    height: 52,
    heightComfortable: 60,
    iconFrame: 24,
  },
  toggleRow: {
    height: 52,
    heightComfortable: 60,
    switchTrackWidth: 48,
    switchTrackHeight: 28,
    switchThumb: 24,
  },
  button: {
    primaryHeight: 48,
    floatingIcon: 44,
    fab: 52,
  },
  card: {
    radius: 16,
    padding: 16,
    gap: 12,
  },
  listCard: {
    minHeight: 96,
    radius: 16,
    padding: 16,
    thumbSize: 64,
    thumbRadius: 16,
    gap: 16,
  },
  surfaceRow: {
    minHeight: 56,
    comfortableHeight: 64,
    radius: 16,
    padding: 16,
    gap: 12,
    iconBox: 40,
  },
  resultRow: {
    compactHeight: 64,
    mediaHeight: 80,
    thumb: 48,
    thumbRadius: 12,
    horizontalPadding: 16,
  },
  archiveRow: {
    minHeight: 80,
    thumb: 56,
    thumbRadius: 12,
  },
  avatar: {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 72,
    xl: 88,
  },
  badge: {
    compactHeight: 18,
    defaultHeight: 20,
    horizontalPadding: 6,
  },
  emptyState: {
    icon: 44,
    verticalPadding: 56,
    maxWidth: 280,
  },
  skeleton: {
    line: 12,
    lineLarge: 16,
    cardHeight: 84,
    heroHeight: 300,
  },
  hero: {
    height: 320,
    overlayOffset: 20,
    indicatorRadius: 10,
  },
  gallery: {
    trayThumb: 72,
    gap: 8,
    radius: 10,
  },
  tabBar: {
    contentHeight: 60,
    icon: 24,
    itemMinWidth: 64,
    itemVerticalPadding: 8,
  },
  modal: {
    horizontalMargin: 20,
    maxWidth: 360,
    radius: 20,
    padding: 24,
  },
  sheet: {
    topRadius: 20,
    handleWidth: 32,
    handleHeight: 4,
    topPadding: 12,
    innerHorizontalPadding: 16,
  },
  actionSheetRow: {
    height: 52,
    heightComfortable: 60,
    iconFrame: 24,
  },
  ctaBar: {
    compactHeight: 80,
    prominentHeight: 88,
    buttonHeight: 48,
    horizontalPadding: 16,
  },
  warningBlock: {
    radius: 12,
    padding: 16,
    icon: 18,
  },
  banner: {
    radius: 12,
    padding: 16,
    icon: 18,
  },
};
