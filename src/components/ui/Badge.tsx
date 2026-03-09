import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';

interface BadgeProps {
  count: number;
  color?: string;
  size?: number;
}

export const Badge: React.FC<BadgeProps> = ({ count, color = colors.accent.danger, size = 20 }) => {
  if (count <= 0) return null;

  return (
    <View style={[styles.badge, { backgroundColor: color, minWidth: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.55 }]}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  text: {
    color: colors.text.inverse,
    fontWeight: '700',
  },
});
