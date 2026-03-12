import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Modal, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius, layout } from '@/theme/tokens';
import { SearchBar } from '@/components/filter/SearchBar';
import { InlineFilterChips } from '@/components/filter/InlineFilterChips';
import { FilterBottomSheet } from '@/components/filter/FilterBottomSheet';
import { AddPlaceFab } from '@/components/place/AddPlaceFab';
import { PlaceCard } from '@/components/place/PlaceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useFilteredPlaceListItems } from '@/hooks/useFilteredPlaceListItems';

export default function ListScreen() {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const [addMenuVisible, setAddMenuVisible] = useState(false);
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(14)).current;

  const { filter, setFilter } = usePlaceStore();
  const { visits } = useVisitStore();
  const filteredPlaceListItems = useFilteredPlaceListItems();

  const visitCountByPlaceId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const visit of visits) {
      counts[visit.placeId] = (counts[visit.placeId] ?? 0) + 1;
    }
    return counts;
  }, [visits]);

  const floatingButtonMargin = layout.screenPaddingH;
  const fabBottom = floatingButtonMargin;

  useFocusEffect(useCallback(() => {
    contentOpacity.setValue(0);
    contentTranslateY.setValue(14);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [contentOpacity, contentTranslateY]));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
          },
        ]}
      >
        {/* Search + Filter */}
        <View style={styles.searchRow}>
          <SearchBar
            value={filter.searchQuery}
            onChangeText={(text) => setFilter({ searchQuery: text })}
            onClear={() => setFilter({ searchQuery: '' })}
          />
        </View>
        <InlineFilterChips onOpenFilter={() => setFilterVisible(true)} style={styles.inlineFilterChips} />

        {/* List */}
        <FlatList
          data={filteredPlaceListItems}
          keyExtractor={(item) => item.place.placeId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.listGap} />}
          renderItem={({ item }) => (
            <PlaceCard
              place={item.place}
              thumbnailUri={item.thumbnailUri}
              visitCount={visitCountByPlaceId[item.place.placeId] ?? 0}
              onPress={() => router.push(`/(main)/place/${item.place.placeId}`)}
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
      </Animated.View>

      <AddPlaceFab
        visible={addMenuVisible}
        bottom={fabBottom}
        onVisibleChange={setAddMenuVisible}
      />

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
    backgroundColor: colors.bg.base,
  },
  content: {
    flex: 1,
  },
  searchRow: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[2],
    marginBottom: spacing[2],
  },
  inlineFilterChips: {
    marginBottom: spacing[4],
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[1],
    paddingBottom: 120,
  },
  listGap: {
    height: spacing[3],
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: colors.bg.base,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
});
