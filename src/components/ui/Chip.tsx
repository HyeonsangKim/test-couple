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
  color = colors.accent.primary,
  style,
  size = 'md',
}) => {
  const paddingV = size === 'sm' ? spacing[1] : spacing[2];
  const paddingH = size === 'sm' ? spacing[3] : spacing[4];
  const typo = size === 'sm' ? typography.caption : typography.body.s;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? color : colors.surface.primary,
          borderColor: selected ? color : colors.border.soft,
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
            color: selected ? colors.text.inverse : colors.text.secondary,
            fontSize: typo.fontSize,
            fontWeight: typo.fontWeight,
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
