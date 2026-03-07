import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme/tokens';

interface AvatarProps {
  name: string;
  color: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, color, size = 36 }) => {
  const initial = name.charAt(0);
  const fontSize = size * 0.45;

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.initial, { fontSize }]}>{initial}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    color: colors.white,
    fontWeight: '700',
  },
});
