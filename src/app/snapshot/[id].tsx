import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, layout, component } from '@/theme/tokens';
import { Chip } from '@/components/ui';
import { BackHeader } from '@/components/common/BackHeader';
import { useSnapshotStore } from '@/stores/useSnapshotStore';
import { STATUS_LABELS, CATEGORY_LABELS } from '@/constants';
import { formatDate } from '@/utils/date';

export default function SnapshotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentSnapshot, loadSnapshot } = useSnapshotStore();

  useEffect(() => {
    if (id) loadSnapshot(id);
  }, [id]);

  if (!currentSnapshot) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Ionicons name="camera-outline" size={component.emptyState.icon} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>스냅샷을 찾을 수 없어요</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="스냅샷" onBack={() => router.back()} backIcon="close" />

      {/* Read-only Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Ionicons name="lock-closed" size={14} color={colors.text.inverse} />
          <Text style={styles.bannerBadgeText}>읽기 전용</Text>
        </View>
        <Text style={styles.bannerDate}>{formatDate(currentSnapshot.createdAt)}</Text>
        <Text style={styles.bannerInfo}>
          {currentSnapshot.places.length}개 장소 · {currentSnapshot.visits.length}개 방문기록
        </Text>
      </View>

      {/* Place List */}
      <FlatList
        data={currentSnapshot.places}
        keyExtractor={(item) => item.placeId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const visitCount = currentSnapshot.visits.filter(
            (v) => v.placeId === item.placeId,
          ).length;

          return (
            <View style={styles.placeCard}>
              <Text style={styles.placeName}>{item.name}</Text>
              {item.addressText && (
                <Text style={styles.placeAddress}>{item.addressText}</Text>
              )}
              <View style={styles.chipRow}>
                <Chip
                  label={STATUS_LABELS[item.status] ?? item.status}
                  selected
                  color={
                    item.status === 'wishlist'
                      ? colors.marker.wishlist
                      : item.status === 'visited'
                        ? colors.marker.visited
                        : colors.marker.orphan
                  }
                  size="sm"
                />
                <Chip
                  label={CATEGORY_LABELS[item.category] ?? item.category}
                  size="sm"
                />
                {visitCount > 0 && (
                  <Text style={styles.visitCountText}>{visitCount}회 방문</Text>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={component.emptyState.icon} color={colors.text.tertiary} />
            <Text style={styles.emptyTitle}>장소가 없어요</Text>
            <Text style={styles.emptyDesc}>이 스냅샷에는 저장된 장소가 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.canvas },
  banner: {
    backgroundColor: colors.bg.soft,
    paddingVertical: spacing[5],
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.text.secondary,
    borderRadius: radius.full,
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[3],
    gap: spacing[1],
    marginBottom: spacing[2],
  },
  bannerBadgeText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '600',
  },
  bannerDate: {
    ...typography.title.m,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  bannerInfo: {
    ...typography.body.s,
    color: colors.text.secondary,
  },
  list: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[10],
  },
  placeCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: 16,
    minHeight: component.archiveRow.minHeight,
    marginBottom: layout.cardGap,
  },
  placeName: {
    ...typography.title.m,
    color: colors.text.primary,
  },
  placeAddress: {
    ...typography.body.s,
    color: colors.text.secondary,
    marginTop: 2,
    marginBottom: spacing[2],
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.cardGap,
    marginTop: spacing[2],
  },
  visitCountText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: component.emptyState.verticalPadding,
    maxWidth: component.emptyState.maxWidth,
    alignSelf: 'center',
  },
  emptyTitle: {
    ...typography.heading.m,
    color: colors.text.primary,
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  emptyDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
