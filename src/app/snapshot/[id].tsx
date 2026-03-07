import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { IconButton, Card, Chip } from '@/components/ui';
import { EmptyState } from '@/components/common/EmptyState';
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
        <EmptyState icon="camera-outline" title="스냅샷을 찾을 수 없어요" description="" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <IconButton icon="close" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>스냅샷</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.banner}>
        <Ionicons name="camera-outline" size={32} color={colors.secondary} style={styles.bannerIcon} />
        <Text style={styles.bannerText}>읽기 전용 스냅샷</Text>
        <Text style={styles.bannerDate}>{formatDate(currentSnapshot.createdAt)}</Text>
        <Text style={styles.bannerPartner}>{currentSnapshot.partnerNickname}와의 기록</Text>
      </View>

      <FlatList
        data={currentSnapshot.places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.placeCard}>
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeAddress}>{item.address}</Text>
            <View style={styles.chipRow}>
              <Chip
                label={STATUS_LABELS[item.status] ?? item.status}
                selected
                color={item.status === 'wishlist' ? colors.markerWishlist : colors.markerVisited}
                size="sm"
              />
              {item.category !== 'none' && (
                <Chip label={CATEGORY_LABELS[item.category] ?? ''} size="sm" />
              )}
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <EmptyState icon="location-outline" title="장소가 없어요" description="이 스냅샷에는 저장된 장소가 없습니다." />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { ...typography.subtitle, color: colors.text },
  banner: {
    backgroundColor: colors.secondaryLight,
    padding: spacing.xl,
    alignItems: 'center',
  },
  bannerIcon: { marginBottom: spacing.sm },
  bannerText: { ...typography.captionBold, color: colors.secondary },
  bannerDate: { ...typography.body, color: colors.secondary, marginTop: spacing.xs },
  bannerPartner: { ...typography.caption, color: colors.secondary, marginTop: spacing.xs },
  list: { padding: spacing.xl },
  placeCard: { marginBottom: spacing.md },
  placeName: { ...typography.bodyBold, color: colors.text },
  placeAddress: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', gap: spacing.sm },
});
