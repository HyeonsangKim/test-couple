import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '@/theme/tokens';
import { UserProfile } from '@/types';

interface AvatarProps {
  user?: UserProfile | null;
  name?: string;
  color?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ user, name, color, size = 36 }) => {
  const displayName = user?.nickname ?? name ?? '?';
  const bgColor = color ?? colors.accent.primary;
  const initial = displayName.charAt(0);
  const fontSize = size * 0.45;

  if (user?.profileImageUri) {
    return (
      <Image
        source={{ uri: user.profileImageUri }}
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      />
    );
  }

  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor }]}>
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
    color: colors.text.inverse,
    fontWeight: '700',
  },
});
