import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, layout } from '@/theme/tokens';
import { SearchBar } from '@/components/filter/SearchBar';
import { FilterBottomSheet } from '@/components/filter/FilterBottomSheet';
import { PlaceCard } from '@/components/place/PlaceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Chip } from '@/components/ui';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useFilteredPlaces } from '@/hooks/useFilteredPlaces';
import { STATUS_LABELS, CATEGORY_LABELS } from '@/constants';

export default function ListScreen() {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);

  const { filter, setFilter, resetFilter } = usePlaceStore();
  const { visits } = useVisitStore();
  const filteredPlaces = useFilteredPlaces();

  const getVisitCount = useCallback(
    (placeId: string) => visits.filter((v) => v.placeId === placeId).length,
    [visits],
  );

  const hasActiveFilter = filter.status !== 'all' || filter.category !== 'all';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>리스트</Text>
        <Text style={styles.countText}>{filteredPlaces.length}개</Text>
      </View>

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={filter.searchQuery}
            onChangeText={(text) => setFilter({ searchQuery: text })}
            onClear={() => setFilter({ searchQuery: '' })}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, hasActiveFilter && styles.filterBtnActive]}
          onPress={() => setFilterVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="funnel-outline"
            size={18}
            color={hasActiveFilter ? colors.text.inverse : colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      {hasActiveFilter && (
        <View style={styles.chipRow}>
          {filter.status !== 'all' && (
            <Chip
              label={STATUS_LABELS[filter.status] ?? filter.status}
              selected
              size="sm"
              onPress={() => setFilter({ status: 'all' })}
            />
          )}
          {filter.category !== 'all' && (
            <Chip
              label={CATEGORY_LABELS[filter.category] ?? filter.category}
              selected
              size="sm"
              onPress={() => setFilter({ category: 'all' })}
            />
          )}
          <TouchableOpacity onPress={resetFilter}>
            <Text style={styles.resetText}>초기화</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredPlaces}
        keyExtractor={(item) => item.placeId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            visitCount={getVisitCount(item.placeId)}
            onPress={() => router.push(`/(main)/place/${item.placeId}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="location-outline"
            title="저장된 장소가 없어요"
            description="지도 탭에서 장소를 추가해보세요"
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(main)/place/add/search')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.text.inverse} />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.filterOverlay}
          activeOpacity={1}
          onPress={() => setFilterVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.filterSheet}>
            <FilterBottomSheet onClose={() => setFilterVisible(false)} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.canvas,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
  },
  headerTitle: {
    ...typography.heading.l,
    color: colors.text.primary,
  },
  countText: {
    ...typography.body.m,
    color: colors.text.tertiary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  searchBarWrapper: {
    flex: 1,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.sm,
  },
  filterBtnActive: {
    backgroundColor: colors.accent.primary,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  resetText: {
    ...typography.caption,
    color: colors.accent.primary,
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: 120,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: layout.screenPaddingH,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.lg,
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: colors.surface.primary,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
});
