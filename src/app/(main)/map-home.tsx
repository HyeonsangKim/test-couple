import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { colors, typography, spacing, radius, shadow } from '@/theme/tokens';
import { Button, IconButton, Card } from '@/components/ui';
import { PlaceMarker } from '@/components/map/PlaceMarker';
import { SearchBar } from '@/components/filter/SearchBar';
import { FilterBottomSheet } from '@/components/filter/FilterBottomSheet';
import { PlaceCard } from '@/components/place/PlaceCard';
import { EmptyState } from '@/components/common/EmptyState';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMapStore } from '@/stores/useMapStore';
import { useFilteredPlaces } from '@/hooks/useFilteredPlaces';
import { Place } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SEOUL_REGION: Region = {
  latitude: 37.5665,
  longitude: 126.9780,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

export default function MapHomeScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [addMenuVisible, setAddMenuVisible] = useState(false);

  const { viewMode, setViewMode, filter, setFilter, selectPlace, addPlace } = usePlaceStore();
  const { visits } = useVisitStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const partner = useAuthStore((s) => s.partner);
  const map = useMapStore((s) => s.map);
  const filteredPlaces = useFilteredPlaces();

  const getVisitCount = useCallback((placeId: string) => {
    return visits.filter((v) => v.placeId === placeId).length;
  }, [visits]);

  const handleMarkerPress = useCallback((place: Place) => {
    selectPlace(place);
    router.push(`/(main)/place/${place.id}`);
  }, []);

  const handleAddBySearch = () => {
    setAddMenuVisible(false);
    // Mock: add a sample place via search
    if (!map || !currentUser) return;
    Alert.alert(
      '장소 검색',
      '검색으로 장소를 추가하는 기능입니다.\n(목업에서는 샘플 장소가 추가됩니다)',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '샘플 추가',
          onPress: async () => {
            await addPlace({
              name: '새로운 카페',
              address: '서울 강남구 역삼동',
              latitude: 37.4979 + Math.random() * 0.02,
              longitude: 127.0276 + Math.random() * 0.02,
              mapId: map.id,
              createdBy: currentUser.id,
              type: 'official',
              status: 'wishlist',
              category: 'food',
              externalPlaceId: `ext_new_${Date.now()}`,
            });
          },
        },
      ],
    );
  };

  const handleAddByPin = () => {
    setAddMenuVisible(false);
    if (!map || !currentUser) return;
    Alert.alert(
      '지도에 핀 찍기',
      '지도를 길게 눌러 핀을 찍는 기능입니다.\n(목업에서는 현재 위치 근처에 핀이 생성됩니다)',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '핀 찍기',
          onPress: async () => {
            await addPlace({
              name: '새로운 장소',
              address: '직접 찍은 위치',
              latitude: 37.5665 + (Math.random() - 0.5) * 0.05,
              longitude: 126.9780 + (Math.random() - 0.5) * 0.05,
              mapId: map.id,
              createdBy: currentUser.id,
              type: 'custom',
              status: 'wishlist',
              category: 'none',
            });
          },
        },
      ],
    );
  };

  const handleAddByPhoto = () => {
    setAddMenuVisible(false);
    router.push('/(main)/visit/create');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.mapName}>{map?.name ?? '커플 지도'}</Text>
          <Text style={styles.partnerInfo}>
            {partner ? `${partner.nickname}와 함께` : '혼자 사용 중'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <IconButton
            icon="⚙️"
            onPress={() => router.push('/(main)/settings/invite')}
            size={36}
            backgroundColor={colors.surface}
          />
        </View>
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
        <IconButton
          icon="🔽"
          onPress={() => setFilterVisible(true)}
          size={40}
          backgroundColor={
            filter.status !== 'all' || filter.category !== 'all'
              ? colors.primaryLight
              : colors.surface
          }
        />
      </View>

      {/* View Mode Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'map' && styles.toggleActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>🗺️ 지도</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>📋 리스트</Text>
        </TouchableOpacity>
        <Text style={styles.countText}>{filteredPlaces.length}개</Text>
      </View>

      {/* Content */}
      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={SEOUL_REGION}
            showsUserLocation
            showsMyLocationButton={false}
          >
            {filteredPlaces.map((place) => (
              <PlaceMarker key={place.id} place={place} onPress={handleMarkerPress} />
            ))}
          </MapView>
        </View>
      ) : (
        <FlatList
          data={filteredPlaces}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <PlaceCard
              place={item}
              visitCount={getVisitCount(item.id)}
              onPress={() => handleMarkerPress(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="📍"
              title="저장된 장소가 없어요"
              description="아래 + 버튼으로 첫 장소를 추가해보세요"
            />
          }
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddMenuVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Add Menu Modal */}
      <Modal visible={addMenuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setAddMenuVisible(false)}>
          <View style={styles.addMenu}>
            <Text style={styles.addMenuTitle}>장소 추가</Text>
            <TouchableOpacity style={styles.addMenuItem} onPress={handleAddBySearch}>
              <Text style={styles.addMenuIcon}>🔍</Text>
              <View>
                <Text style={styles.addMenuLabel}>검색으로 추가</Text>
                <Text style={styles.addMenuDesc}>장소를 검색해서 등록</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addMenuItem} onPress={handleAddByPin}>
              <Text style={styles.addMenuIcon}>📌</Text>
              <View>
                <Text style={styles.addMenuLabel}>지도에 핀 찍기</Text>
                <Text style={styles.addMenuDesc}>원하는 위치에 직접 표시</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addMenuItem} onPress={handleAddByPhoto}>
              <Text style={styles.addMenuIcon}>📷</Text>
              <View>
                <Text style={styles.addMenuLabel}>사진으로 추가</Text>
                <Text style={styles.addMenuDesc}>사진과 함께 방문기록 남기기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Filter Modal */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setFilterVisible(false)}>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  mapName: {
    ...typography.h3,
    color: colors.text,
  },
  partnerInfo: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  searchBarWrapper: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  toggleBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.white,
  },
  countText: {
    ...typography.caption,
    color: colors.textTertiary,
    marginLeft: 'auto',
  },
  mapContainer: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  map: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.lg,
  },
  fabIcon: {
    fontSize: 28,
    color: colors.white,
    fontWeight: '300',
    marginTop: -2,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
    padding: spacing.xxl,
  },
  addMenu: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
  },
  addMenuTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  addMenuIcon: {
    fontSize: 28,
  },
  addMenuLabel: {
    ...typography.bodyBold,
    color: colors.text,
  },
  addMenuDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  filterOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  filterSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
});
