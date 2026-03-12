import React, { useState, useCallback, useRef } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Modal, Text, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, layout, component } from '@/theme/tokens';
import { SearchBar } from '@/components/filter/SearchBar';
import { InlineFilterChips } from '@/components/filter/InlineFilterChips';
import { FilterBottomSheet } from '@/components/filter/FilterBottomSheet';
import { PlaceCard } from '@/components/place/PlaceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useFilteredPlaces } from '@/hooks/useFilteredPlaces';

export default function ListScreen() {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(14)).current;

  const { filter, setFilter } = usePlaceStore();
  const { visits } = useVisitStore();
  const filteredPlaces = useFilteredPlaces();

  const getVisitCount = useCallback(
    (placeId: string) => visits.filter((v) => v.placeId === placeId).length,
    [visits],
  );

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
          data={filteredPlaces}
          keyExtractor={(item) => item.placeId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.listGap} />}
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
      </Animated.View>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: fabBottom }]}
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
  fab: {
    position: 'absolute',
    right: layout.screenPaddingH,
    width: component.button.fab,
    height: component.button.fab,
    borderRadius: component.button.fab / 2,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 6,
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: colors.bg.sheet,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
});
