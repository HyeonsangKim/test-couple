import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Place } from '@/types';
import { colors, typography, spacing, component } from '@/theme/tokens';
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

const getStatusBadgeStyle = (status: string): { bg: string; text: string } => {
  switch (status) {
    case 'wishlist':
      return { bg: 'rgba(245,158,11,0.10)', text: colors.marker.wishlist };
    case 'visited':
      return { bg: 'rgba(24,178,107,0.10)', text: colors.marker.visited };
    default:
      return { bg: colors.bg.muted, text: colors.text.tertiary };
  }
};

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, visitCount, onPress }) => {
  const statusInfo = getStatusIcon(place.status);
  const badgeStyle = getStatusBadgeStyle(place.status);

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.6}>
      {/* Thumbnail */}
      {place.heroImageId ? (
        <Image source={{ uri: place.heroImageId }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholder]}>
          <Ionicons name={statusInfo.icon} size={20} color={statusInfo.color} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{place.name}</Text>
          {place.deleteRequest && (
            <Ionicons name="trash-outline" size={12} color={colors.status.deleteRequest} style={styles.trashIcon} />
          )}
        </View>
        {place.addressText ? (
          <Text style={styles.address} numberOfLines={1}>{place.addressText}</Text>
        ) : null}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
              {STATUS_LABELS[place.status] || place.status}
            </Text>
          </View>
          {place.category !== 'uncategorized' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{CATEGORY_LABELS[place.category] || place.category}</Text>
            </View>
          )}
          {visitCount > 1 && (
            <Text style={styles.visitCount}>{visitCount}회</Text>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: component.listCard.minHeight,
    paddingVertical: component.listCard.padding,
    gap: component.listCard.gap,
  },
  thumbnail: {
    width: component.listCard.thumbSize,
    height: component.listCard.thumbSize,
    borderRadius: component.listCard.thumbRadius,
    backgroundColor: colors.bg.subtle,
    flexShrink: 0,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 3,
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
    ...typography.body.m,
    color: colors.text.secondary,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: 2,
  },
  badge: {
    height: component.badge.compactHeight,
    borderRadius: 999,
    paddingHorizontal: component.badge.horizontalPadding,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg.muted,
  },
  badgeText: {
    ...typography.micro,
    color: colors.text.secondary,
  },
  visitCount: {
    ...typography.micro,
    color: colors.text.tertiary,
  },
});
