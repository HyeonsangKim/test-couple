export const colors = {
  primary: '#FF6B9D',
  primaryLight: '#FFB4CC',
  primaryDark: '#E5527F',
  secondary: '#9D7AFF',
  secondaryLight: '#C4AFFF',
  mint: '#50D492',
  mintLight: '#A0E8C8',
  cream: '#FFFDF7',
  background: '#FFFDF7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  text: '#2D2D3A',
  textSecondary: '#8E8E9A',
  textTertiary: '#B8B8C4',
  border: '#F0EEF5',
  borderFocused: '#FF6B9D',
  error: '#FF4757',
  warning: '#FFA726',
  success: '#50D492',
  overlay: 'rgba(0,0,0,0.4)',
  // Marker colors
  markerWishlist: '#FF6B9D',
  markerVisited: '#50D492',
  markerOrphan: '#C4C4D0',
  // Category colors
  categoryFood: '#FF8A65',
  categoryTravel: '#4FC3F7',
  categoryFun: '#FFD54F',
  categorySpecial: '#CE93D8',
  categoryNone: '#B8B8C4',
  // Chat bubbles
  bubbleMine: '#FFE8F0',
  bubblePartner: '#F0EEFF',
  white: '#FFFFFF',
  black: '#000000',
  deleteRed: '#FF4757',
  deleteBg: '#FFF0F0',
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  subtitle: { fontSize: 17, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  captionBold: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  small: { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
