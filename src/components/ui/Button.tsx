import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, radius, component } from '@/theme/tokens';

/**
 * New canonical variants:
 *   fill-primary | fill-dark | soft-secondary | ghost | ghost-danger
 *
 * Legacy names are mapped for backwards compatibility:
 *   primary   → fill-primary
 *   secondary → soft-secondary
 *   outline   → soft-secondary
 *   danger    → ghost-danger
 */
type Variant =
  | 'fill-primary'
  | 'fill-dark'
  | 'soft-secondary'
  | 'ghost'
  | 'ghost-danger'
  // legacy aliases
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

// Normalise legacy variant names to canonical ones
const resolveVariant = (v: Variant): Exclude<Variant, 'primary' | 'secondary' | 'outline' | 'danger'> => {
  switch (v) {
    case 'primary':
      return 'fill-primary';
    case 'secondary':
    case 'outline':
      return 'soft-secondary';
    case 'danger':
      return 'ghost-danger';
    default:
      return v;
  }
};

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const resolved = resolveVariant(variant);

  const bgColor: Record<string, string> = {
    'fill-primary': colors.accent.primary,
    'fill-dark': colors.bg.strong,
    'soft-secondary': colors.bg.soft,
    'ghost': 'transparent',
    'ghost-danger': 'transparent',
  };

  const txtColor: Record<string, string> = {
    'fill-primary': colors.text.inverse,
    'fill-dark': colors.text.inverse,
    'soft-secondary': colors.text.primary,
    'ghost': colors.text.primary,
    'ghost-danger': colors.accent.danger,
  };

  const height = size === 'lg'
    ? component.button.primaryHeight
    : size === 'sm'
      ? 40
      : 48;

  const typo = size === 'lg' ? typography.button.l : typography.button.m;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: bgColor[resolved],
          height,
          borderRadius: height / 2,
          paddingHorizontal: 24,
          opacity: disabled ? 0.45 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={txtColor[resolved]} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: txtColor[resolved],
              fontSize: typo.fontSize,
              lineHeight: typo.lineHeight,
              fontWeight: typo.fontWeight,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
  },
});
