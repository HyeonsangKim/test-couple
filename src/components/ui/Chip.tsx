import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, component } from '@/theme/tokens';

type ChipSelection = 'neutral' | 'accent';

interface ChipProps {
  label: string;
  selected?: boolean;
  /** Which selection style to use when `selected` is true */
  selectionStyle?: ChipSelection;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  /** @deprecated Legacy prop -- kept for backwards compatibility. Ignored in the new design. */
  color?: string;
  /** @deprecated Legacy prop -- kept for backwards compatibility. 'sm' renders a compact chip. */
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  selectionStyle = 'neutral',
  onPress,
  disabled = false,
  style,
  color,
  size = 'md',
}) => {
  const isCompact = size === 'sm';

  const getBg = (): string => {
    if (!selected) return colors.bg.elevated;
    if (color) return `${color}20`; // 12% opacity tint of the status color
    return selectionStyle === 'accent'
      ? colors.accent.primarySoft
      : colors.bg.soft;
  };

  const getTextColor = (): string => {
    if (!selected) return colors.text.secondary;
    if (color) return color;
    return selectionStyle === 'accent'
      ? colors.accent.primary
      : colors.text.primary;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || !onPress}
      style={[
        styles.chip,
        {
          backgroundColor: getBg(),
          opacity: disabled ? 0.45 : 1,
          height: isCompact ? 36 : component.chip.height,
          borderRadius: isCompact ? 18 : component.chip.radius,
          paddingHorizontal: isCompact ? 12 : 16,
        },
        style,
      ]}
    >
      <Text
        style={[
          isCompact ? styles.labelCompact : styles.label,
          { color: getTextColor() },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.title.m.fontSize,
    lineHeight: typography.title.m.lineHeight,
    fontWeight: typography.title.m.fontWeight,
  },
  labelCompact: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.caption.fontWeight,
  },
});
