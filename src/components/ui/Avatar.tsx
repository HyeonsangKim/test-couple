import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, radius, component } from '@/theme/tokens';
import { UserProfile } from '@/types';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  user?: UserProfile | null;
  name?: string;
  color?: string;
  /** Numeric pixel value or named size from design tokens */
  size?: number | AvatarSize;
}

const resolveSize = (size: number | AvatarSize): number => {
  if (typeof size === 'number') return size;
  return component.avatar[size];
};

export const Avatar: React.FC<AvatarProps> = ({ user, name, color, size = 'sm' }) => {
  const px = resolveSize(size);
  const displayName = user?.nickname ?? name ?? '?';
  const bgColor = color ?? colors.bg.soft;
  const initial = displayName.charAt(0);
  const fontSize = px * 0.45;

  if (user?.profileImageUri) {
    return (
      <Image
        source={{ uri: user.profileImageUri }}
        style={[
          styles.avatar,
          { width: px, height: px, borderRadius: radius.full },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        { width: px, height: px, borderRadius: radius.full, backgroundColor: bgColor },
      ]}
    >
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
    color: colors.text.secondary,
    fontWeight: '700',
  },
});
