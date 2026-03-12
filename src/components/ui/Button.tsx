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
 *   fill-primary | fill-danger | fill-dark | soft-secondary | ghost | ghost-danger
 *
 * Legacy names are mapped for backwards compatibility:
 *   primary   → fill-primary
 *   secondary → soft-secondary
 *   outline   → soft-secondary
 *   danger    → ghost-danger
 */
type Variant =
  | 'fill-primary'
  | 'fill-danger'
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
  const isDisabled = disabled;

  const bgColor: Record<string, string> = {
    'fill-primary': colors.accent.primary,
    'fill-danger': colors.accent.danger,
    'fill-dark': colors.bg.strong,
    'soft-secondary': colors.bg.soft,
    'ghost': 'transparent',
    'ghost-danger': 'transparent',
  };

  const txtColor: Record<string, string> = {
    'fill-primary': colors.text.inverse,
    'fill-danger': colors.text.inverse,
    'fill-dark': colors.text.inverse,
    'soft-secondary': colors.text.primary,
    'ghost': colors.text.primary,
    'ghost-danger': colors.accent.danger,
  };

  const disabledBgColor: Record<string, string> = {
    'fill-primary': colors.accent.primarySoft,
    'fill-danger': colors.bg.muted,
    'fill-dark': colors.bg.muted,
    'soft-secondary': colors.bg.muted,
    'ghost': 'transparent',
    'ghost-danger': 'transparent',
  };

  const disabledTxtColor: Record<string, string> = {
    'fill-primary': colors.accent.primary,
    'fill-danger': colors.text.tertiary,
    'fill-dark': colors.text.tertiary,
    'soft-secondary': colors.text.tertiary,
    'ghost': colors.text.tertiary,
    'ghost-danger': colors.text.tertiary,
  };

  const backgroundColor = isDisabled ? disabledBgColor[resolved] : bgColor[resolved];
  const textColor = isDisabled ? disabledTxtColor[resolved] : txtColor[resolved];

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
          backgroundColor,
          height,
          borderRadius: height / 2,
          paddingHorizontal: 24,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
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
