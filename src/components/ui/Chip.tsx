import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme/tokens';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  color?: string;
  style?: ViewStyle;
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  color = colors.primary,
  style,
  size = 'md',
}) => {
  const paddingV = size === 'sm' ? spacing.xs : spacing.sm;
  const paddingH = size === 'sm' ? spacing.md : spacing.lg;
  const fontSize = size === 'sm' ? 12 : 13;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color : colors.surface,
          borderColor: selected ? color : colors.border,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: selected ? colors.white : colors.textSecondary,
            fontSize,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
