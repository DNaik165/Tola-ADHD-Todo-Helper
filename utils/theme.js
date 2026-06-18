// utils/theme.js

export const COLORS = {
  primary: '#7FB3D5', // Softer Skyblue
  secondary: '#FADBD8', // Softer Pink
  accent: '#F7DC6F', // Softer Gold
  background: '#F4F7F9', // Very subtle blue-grey
  cardBackground: '#FFFFFF',
  textPrimary: '#2C3E50', // Soft Slate
  textSecondary: '#7F8C8D', // Soft Grey
  success: '#ABEBC6', // Soft Pastel Green
  danger: '#F1948A', // Soft Pastel Red
  warning: '#F8C471', // Soft Pastel Orange
  white: '#FFFFFF',
  shadow: '#000000',
};

export const FONTS = {
  regular: 'BubblegumSans-Regular',
  bubbles: 'RubikBubbles-Regular',
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};
