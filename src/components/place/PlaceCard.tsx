import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '@/types';
import { colors, typography, spacing, shadow, component } from '@/theme/tokens';
import { Chip } from '@/components/ui';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/constants';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface PlaceCardProps {
  place: Place;
  visitCount: number;
  onPress: () => void;
}

const getStatusIcon = (status: string): { icon: IoniconsName; color: string } => {
  switch (status) {
    case 'wishlist':
      return { icon: 'heart', color: colors.marker.wishlist };
    case 'visited':
      return { icon: 'checkmark-circle', color: colors.marker.visited };
    default:
      return { icon: 'location', color: colors.marker.orphan };
  }
};

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, visitCount, onPress }) => {
  const statusColor = place.status === 'wishlist'
    ? colors.marker.wishlist
    : place.status === 'visited'
      ? colors.marker.visited
      : colors.marker.orphan;
  const statusInfo = getStatusIcon(place.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {place.heroImageId ? (
        <Image source={{ uri: place.heroImageId }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name={statusInfo.icon} size={28} color={statusInfo.color} />
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
          {place.deleteRequest && (
            <Ionicons name="trash-outline" size={14} color={colors.status.deleteRequest} style={styles.trashIcon} />
          )}
        </View>
        <Text style={styles.address} numberOfLines={1}>{place.addressText}</Text>
        <View style={styles.metaRow}>
          <Chip
            label={STATUS_LABELS[place.status] || place.status}
            color={statusColor}
            selected
            size="sm"
          />
          {place.category !== 'uncategorized' && (
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
    backgroundColor: colors.bg.elevated,
    borderRadius: component.listCard.radius,
    padding: component.listCard.padding,
    marginBottom: spacing[4],
    minHeight: component.listCard.minHeight,
    ...shadow.sm,
  },
  image: {
    width: component.listCard.thumbSize,
    height: component.listCard.thumbSize,
    borderRadius: component.listCard.thumbRadius,
    backgroundColor: colors.bg.soft,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: component.listCard.gap,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    ...typography.title.m,
    color: colors.text.primary,
    flex: 1,
  },
  trashIcon: {
    marginLeft: spacing[1],
  },
  address: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
    marginBottom: spacing[2],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[1],
  },
  categoryChip: {
    marginLeft: spacing[1],
  },
  visitCount: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginLeft: spacing[1],
  },
});
