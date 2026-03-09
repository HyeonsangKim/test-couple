import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme/tokens';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

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
  const bgColor = {
    primary: colors.accent.primary,
    secondary: colors.accent.secondary,
    outline: 'transparent',
    ghost: 'transparent',
    danger: colors.accent.danger,
  }[variant];

  const txtColor = {
    primary: colors.text.inverse,
    secondary: colors.text.primary,
    outline: colors.accent.primary,
    ghost: colors.text.primary,
    danger: colors.text.inverse,
  }[variant];

  const borderClr = variant === 'outline' ? colors.accent.primary : 'transparent';

  const paddingV = { sm: spacing[2], md: spacing[3], lg: spacing[4] }[size];
  const paddingH = { sm: spacing[4], md: spacing[5], lg: spacing[6] }[size];
  const typo = size === 'lg' ? typography.button.l : typography.button.m;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: disabled ? colors.border.strong : bgColor,
          borderColor: disabled ? colors.border.strong : borderClr,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={txtColor} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: disabled ? colors.text.tertiary : txtColor,
              fontSize: typo.fontSize,
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
    borderRadius: radius.md,
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
