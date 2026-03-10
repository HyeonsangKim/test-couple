// Design System PRD v1 — Single Source of Truth
// All values match design_prd_draft_eng.md exactly.

export const colors = {
  bg: {
    canvas: '#F7F4F2',
    elevated: '#FCFAF8',
    soft: '#F1ECE9',
    strong: '#231F26',
  },
  overlay: {
    dim: 'rgba(17,14,19,0.18)',
  },
  text: {
    primary: '#201B22',
    secondary: '#6E6772',
    tertiary: '#9D96A1',
    inverse: '#FFFFFF',
  },
  border: {
    soft: 'rgba(32,27,34,0.08)',
    strong: 'rgba(32,27,34,0.14)',
  },
  glass: {
    fill: 'rgba(252,250,248,0.82)',
    fillStrong: 'rgba(252,250,248,0.90)',
    stroke: 'rgba(255,255,255,0.34)',
  },
  accent: {
    primary: '#E94B82',
    primaryPressed: '#D63D73',
    primarySoft: '#F8DCE7',
    mint: '#27AE60',
    amber: '#D9A441',
    info: '#4E8FD6',
    danger: '#D64545',
  },
  gradient: {
    blushStart: '#F6D7D0',
    blushEnd: '#E7B8C8',
  },
  // Semantic map markers
  marker: {
    wishlist: '#D9A441',
    visited: '#27AE60',
    orphan: '#9D96A1',
  },
  // Category colors
  category: {
    food: '#E67E22',
    travel: '#3498DB',
    activity: '#F1C40F',
    special: '#9B59B6',
    uncategorized: '#9D96A1',
  },
  // Status
  status: {
    deleteRequest: '#D64545',
    deleteBg: 'rgba(214,69,69,0.08)',
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
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  sheet: 32,
  full: 999,
};

export const typography = {
  display: {
    l: { fontSize: 40, lineHeight: 48, fontWeight: '700' as const },
    m: { fontSize: 32, lineHeight: 40, fontWeight: '700' as const },
  },
  heading: {
    l: { fontSize: 28, lineHeight: 36, fontWeight: '700' as const },
    m: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  },
  title: {
    l: { fontSize: 20, lineHeight: 28, fontWeight: '700' as const },
    m: { fontSize: 18, lineHeight: 26, fontWeight: '600' as const },
  },
  body: {
    l: { fontSize: 17, lineHeight: 24, fontWeight: '400' as const },
    m: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
    s: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
  micro: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  button: {
    l: { fontSize: 17, lineHeight: 22, fontWeight: '600' as const },
    m: { fontSize: 15, lineHeight: 20, fontWeight: '600' as const },
  },
};

export const shadow = {
  sm: {
    shadowColor: 'rgba(32,27,34,1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  md: {
    shadowColor: 'rgba(32,27,34,1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  lg: {
    shadowColor: 'rgba(32,27,34,1)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.10,
    shadowRadius: 32,
    elevation: 6,
  },
  xl: {
    shadowColor: 'rgba(32,27,34,1)',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 44,
    elevation: 8,
  },
  glass: {
    shadowColor: 'rgba(32,27,34,1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.10,
    shadowRadius: 28,
    elevation: 5,
  },
};

export const glass = {
  blur: 10,
  blurStrong: 12,
  saturation: 1.1,
  border: {
    width: 1,
    color: colors.glass.stroke,
  },
  fill: colors.glass.fill,
  fillStrong: colors.glass.fillStrong,
  fallback: {
    background: colors.glass.fillStrong,
    borderColor: colors.border.soft,
  },
};

export const motion = {
  fast: 120,
  normal: 180,
  emphasis: 260,
  sheet: 320,
  page: 280,
  breathe: 1400,
};

export const layout = {
  screenPaddingH: 20,
  formPaddingH: 16,
  sectionGap: 24,
  cardGap: 16,
  headerToContent: 16,
  cardPaddingInner: 20,
  inlineGap: 8,
};

// Component-level dimension tokens
export const component = {
  header: {
    height: 56,
    horizontalPadding: 20,
    iconButton: 48,
  },
  searchBar: {
    height: 56,
    radius: 28,
    icon: 20,
    horizontalPadding: 20,
  },
  input: {
    height: 56,
    heightLarge: 64,
    radius: 20,
    horizontalPadding: 16,
    verticalPadding: 16,
  },
  textarea: {
    minHeight: 132,
    maxHeight: 196,
    composerMinHeight: 52,
    composerMaxHeight: 116,
    radius: 20,
  },
  chip: {
    height: 44,
    radius: 22,
  },
  segmentedControl: {
    height: 52,
    thumbHeight: 44,
    radius: 26,
  },
  settingsRow: {
    height: 56,
    heightComfortable: 64,
    iconFrame: 32,
  },
  toggleRow: {
    height: 56,
    heightComfortable: 64,
    switchTrackWidth: 52,
    switchTrackHeight: 32,
    switchThumb: 28,
  },
  button: {
    primaryHeight: 56,
    floatingIcon: 48,
    fab: 56,
  },
  card: {
    radius: 24,
    padding: 20,
    gap: 12,
  },
  listCard: {
    minHeight: 104,
    radius: 24,
    padding: 16,
    thumbSize: 72,
    thumbRadius: 16,
    gap: 16,
  },
  resultRow: {
    compactHeight: 72,
    mediaHeight: 88,
    thumb: 56,
    thumbRadius: 16,
    horizontalPadding: 20,
  },
  archiveRow: {
    minHeight: 92,
    thumb: 64,
    thumbRadius: 16,
  },
  avatar: {
    xs: 32,
    sm: 40,
    md: 56,
    lg: 80,
    xl: 96,
  },
  badge: {
    compactHeight: 24,
    defaultHeight: 28,
    horizontalPadding: 12,
  },
  emptyState: {
    icon: 48,
    verticalPadding: 64,
    maxWidth: 280,
  },
  skeleton: {
    line: 12,
    lineLarge: 16,
    cardHeight: 104,
    heroHeight: 320,
  },
  hero: {
    height: 360,
    overlayOffset: 20,
    indicatorRadius: 12,
  },
  gallery: {
    trayThumb: 80,
    gap: 8,
    radius: 16,
  },
  tabBar: {
    contentHeight: 64,
    icon: 24,
    itemMinWidth: 68,
    itemVerticalPadding: 8,
  },
  modal: {
    horizontalMargin: 20,
    maxWidth: 360,
    radius: 28,
    padding: 24,
  },
  sheet: {
    topRadius: 32,
    handleWidth: 36,
    handleHeight: 4,
    topPadding: 12,
    innerHorizontalPadding: 20,
  },
  actionSheetRow: {
    height: 56,
    heightComfortable: 64,
    iconFrame: 32,
  },
  ctaBar: {
    compactHeight: 88,
    prominentHeight: 96,
    buttonHeight: 56,
    horizontalPadding: 20,
  },
  warningBlock: {
    radius: 20,
    padding: 16,
    icon: 20,
  },
  banner: {
    radius: 20,
    padding: 16,
    icon: 20,
  },
};
