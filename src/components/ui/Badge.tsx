import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, radius, component } from '@/theme/tokens';

type BadgeState = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  /** Numeric count (renders as number) or string label */
  label?: string;
  count?: number;
  state?: BadgeState;
  compact?: boolean;
  style?: ViewStyle;
}

const stateStyles: Record<BadgeState, { bg: string; text: string }> = {
  neutral: { bg: colors.bg.soft, text: colors.text.secondary },
  accent: { bg: colors.accent.primarySoft, text: colors.accent.primary },
  success: { bg: 'rgba(39,174,96,0.12)', text: colors.accent.mint },
  warning: { bg: 'rgba(217,164,65,0.12)', text: colors.accent.amber },
  danger: { bg: 'rgba(214,69,69,0.10)', text: colors.accent.danger },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  count,
  state = 'neutral',
  compact = false,
  style,
}) => {
  // If count is provided and <= 0, render nothing (backwards compat)
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
          borderRadius: radius.full,
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
    ...typography.caption,
  },
});
