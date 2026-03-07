import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Place } from '@/types';
import { colors, typography, spacing, radius, shadow } from '@/theme/tokens';
import { Chip } from '@/components/ui';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/constants';
import { formatDate } from '@/utils/date';

interface PlaceCardProps {
  place: Place;
  visitCount: number;
  onPress: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, visitCount, onPress }) => {
  const statusColor = place.status === 'wishlist' ? colors.markerWishlist : place.status === 'visited' ? colors.markerVisited : colors.markerOrphan;
  const statusIcon = place.status === 'wishlist' ? '💗' : place.status === 'visited' ? '✅' : '📍';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {place.heroImageUri ? (
        <Image source={{ uri: place.heroImageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderIcon}>{statusIcon}</Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
          {place.deleteRequest && <Text style={styles.trashIcon}>🗑️</Text>}
        </View>
        <Text style={styles.address} numberOfLines={1}>{place.address}</Text>
        <View style={styles.metaRow}>
          <Chip
            label={STATUS_LABELS[place.status] || place.status}
            color={statusColor}
            selected
            size="sm"
          />
          {place.category !== 'none' && (
            <Chip
              label={CATEGORY_LABELS[place.category] || place.category}
              size="sm"
              style={styles.categoryChip}
            />
          )}
          {visitCount > 1 && (
            <Text style={styles.visitCount}>{visitCount}회 방문</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadow.sm,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 1,
  },
  trashIcon: {
    fontSize: 14,
    marginLeft: spacing.xs,
  },
  address: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryChip: {
    marginLeft: spacing.xs,
  },
  visitCount: {
    ...typography.small,
    color: colors.textTertiary,
    marginLeft: spacing.xs,
  },
});
