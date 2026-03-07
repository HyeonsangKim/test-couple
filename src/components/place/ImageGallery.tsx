import React from 'react';
import { View, Image, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity } from 'react-native';
import { colors, spacing, radius, typography } from '@/theme/tokens';

interface ImageGalleryProps {
  imageUris: string[];
  onImagePress?: (index: number) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = (SCREEN_WIDTH - spacing.xxl * 2 - spacing.sm * 2) / 3;

export const ImageGallery: React.FC<ImageGalleryProps> = ({ imageUris, onImagePress }) => {
  if (imageUris.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사진 모아보기 ({imageUris.length})</Text>
      <View style={styles.grid}>
        {imageUris.map((uri, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onImagePress?.(index)}
            activeOpacity={0.8}
          >
            <Image source={{ uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
});
