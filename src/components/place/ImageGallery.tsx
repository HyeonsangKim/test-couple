import React from 'react';
import { View, Image, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import { VisitImage } from '@/types';
import { colors, spacing, typography, layout, component } from '@/theme/tokens';

interface ImageGalleryProps {
  images: VisitImage[];
  onImagePress?: (index: number) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_GAP = component.gallery.gap;
const IMAGE_SIZE = (SCREEN_WIDTH - layout.screenPaddingH * 2 - IMAGE_GAP * 2) / 3;

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImagePress }) => {
  if (images.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사진 모아보기 ({images.length})</Text>
      <View style={styles.grid}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={image.imageId}
            onPress={() => onImagePress?.(index)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: image.uri }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[4],
  },
  title: {
    ...typography.title.m,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: IMAGE_GAP,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: component.gallery.radius,
    backgroundColor: colors.bg.soft,
  },
});
