import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Visit, VisitImage } from '@/types';
import { colors, typography, spacing, radius, component } from '@/theme/tokens';
import { formatDate } from '@/utils/date';

interface VisitRecordCardProps {
  visit: Visit;
  images?: VisitImage[];
  visitNumber: number;
  authorName?: string;
  onPress?: () => void;
}

export const VisitRecordCard: React.FC<VisitRecordCardProps> = ({
  visit,
  images = [],
  visitNumber,
  authorName,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <Text style={styles.date}>{formatDate(visit.visitDate)}</Text>
          {visitNumber > 1 && (
            <View style={styles.visitBadge}>
              <Text style={styles.visitBadgeText}>{visitNumber}번째</Text>
            </View>
          )}
        </View>
        <Text style={styles.author}>{authorName ?? '알 수 없음'}</Text>
      </View>
      {images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
          {images.map((img) => (
            <Image key={img.imageId} source={{ uri: img.uri }} style={styles.thumbnail} />
          ))}
        </ScrollView>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.md,
    padding: spacing[4],
    marginBottom: spacing[2],
    borderWidth: 1,
    borderColor: colors.border.soft,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  date: {
    ...typography.title.m,
    color: colors.text.primary,
  },
  visitBadge: {
    backgroundColor: colors.bg.soft,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  visitBadgeText: {
    ...typography.caption,
    color: colors.accent.mint,
    fontWeight: '700',
  },
  author: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: spacing[1],
  },
  thumbnail: {
    width: component.gallery.trayThumb,
    height: component.gallery.trayThumb,
    borderRadius: component.gallery.radius,
    marginRight: component.gallery.gap,
    backgroundColor: colors.bg.soft,
  },
});
