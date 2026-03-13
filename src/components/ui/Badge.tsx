import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, component } from '@/theme/tokens';

type BadgeState = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  label?: string;
  count?: number;
  state?: BadgeState;
  compact?: boolean;
  style?: ViewStyle;
}

const stateStyles: Record<BadgeState, { bg: string; text: string }> = {
  neutral: { bg: colors.bg.muted, text: colors.text.secondary },
  accent: { bg: colors.accent.soft, text: colors.accent.primary },
  success: { bg: colors.toneSurface.success, text: colors.accent.mint },
  warning: { bg: colors.toneSurface.warning, text: colors.accent.warning },
  danger: { bg: colors.toneSurface.danger, text: colors.accent.danger },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  count,
  state = 'neutral',
  compact = false,
  style,
}) => {
  if (count !== undefined && count <= 0) return null;

  const displayText =
    count !== undefined
      ? count > 99
        ? '99+'
        : String(count)
      : label ?? '';

  const { bg, text } = stateStyles[state];
  const height = compact ? component.badge.compactHeight : component.badge.defaultHeight;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          minWidth: height,
          height,
          borderRadius: 999,
          paddingHorizontal: component.badge.horizontalPadding,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: text }]}>{displayText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.micro,
  },
});
