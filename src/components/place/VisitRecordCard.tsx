import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { VisitRecord } from '@/types';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { formatDate } from '@/utils/date';
import { useAuthStore } from '@/stores/useAuthStore';

interface VisitRecordCardProps {
  visit: VisitRecord;
  visitNumber: number;
  onPress?: () => void;
}

export const VisitRecordCard: React.FC<VisitRecordCardProps> = ({ visit, visitNumber, onPress }) => {
  const getUserById = useAuthStore((s) => s.getUserById);
  const author = getUserById(visit.createdBy);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7} disabled={!onPress}>
      <View style={styles.header}>
        <View style={styles.dateRow}>
          <Text style={styles.date}>{formatDate(visit.date)}</Text>
          {visitNumber > 1 && (
            <View style={styles.visitBadge}>
              <Text style={styles.visitBadgeText}>{visitNumber}번째</Text>
            </View>
          )}
        </View>
        <Text style={styles.author}>{author?.nickname ?? '알 수 없음'}</Text>
      </View>
      {visit.imageUris.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
          {visit.imageUris.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.thumbnail} />
          ))}
        </ScrollView>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  date: {
    ...typography.bodyBold,
    color: colors.text,
  },
  visitBadge: {
    backgroundColor: colors.mintLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  visitBadgeText: {
    ...typography.small,
    color: colors.mint,
    fontWeight: '700',
  },
  author: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.border,
  },
});
