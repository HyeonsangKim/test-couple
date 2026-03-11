import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, component } from '@/theme/tokens';

type ChipSelection = 'neutral' | 'accent';

interface ChipProps {
  label: string;
  selected?: boolean;
  selectionStyle?: ChipSelection;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  /** @deprecated kept for backwards compatibility */
  color?: string;
  /** @deprecated 'sm' renders a compact chip */
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
    if (!selected) return colors.bg.subtle;
    if (color) return `${color}18`;
    return selectionStyle === 'accent' ? colors.accent.soft : colors.bg.muted;
  };

  const getTextColor = (): string => {
    if (!selected) return colors.text.secondary;
    if (color) return color;
    return selectionStyle === 'accent' ? colors.accent.primary : colors.text.primary;
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
          height: isCompact ? 30 : component.chip.height,
          borderRadius: isCompact ? 15 : component.chip.radius,
          paddingHorizontal: isCompact ? 10 : 14,
          borderWidth: 1,
          borderColor: selected ? 'transparent' : colors.line.default,
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
    ...typography.body.m,
    fontWeight: '500',
  },
  labelCompact: {
    ...typography.micro,
    fontWeight: '500',
  },
});
