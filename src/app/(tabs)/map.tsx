import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, glass, layout } from '@/theme/tokens';
import { SearchBar } from '@/components/filter/SearchBar';
import { PlaceMarker } from '@/components/map/PlaceMarker';
import { MapSearchResultsSheet } from '@/components/map/MapSearchResultsSheet';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useHomeStore } from '@/stores/useHomeStore';
import { useFilteredPlaces } from '@/hooks/useFilteredPlaces';
import { searchService } from '@/services/searchService';
import { Place, MapApiResult } from '@/types';
import { DEFAULT_MAP_REGION } from '@/constants';
import { FilterBottomSheet } from '@/components/filter/FilterBottomSheet';

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [addMenuVisible, setAddMenuVisible] = useState(false);

  const { filter } = usePlaceStore();
  const filteredPlaces = useFilteredPlaces();

  const {
    homeSearchQuery,
    mapApiResults,
    mapSearchSheetOpen,
    setHomeSearchQuery,
    setMapApiResults,
    setMapSearchSheetOpen,
  } = useHomeStore();

  // Saved places for deduplication and display in the sheet
  const { places } = usePlaceStore();

  // Search external places when query changes
  useEffect(() => {
    if (!homeSearchQuery.trim()) {
      setMapApiResults([]);
      return;
    }

    let cancelled = false;
    const doSearch = async () => {
      const results = await searchService.searchPlaces(homeSearchQuery);
      if (!cancelled) {
        setMapApiResults(results);
      }
    };

    doSearch();
    return () => {
      cancelled = true;
    };
  }, [homeSearchQuery, setMapApiResults]);

  const handleSearchChange = useCallback(
    (text: string) => {
      setHomeSearchQuery(text);
      if (text.trim()) {
        setMapSearchSheetOpen(true);
      }
    },
    [setHomeSearchQuery, setMapSearchSheetOpen]
  );

  const handleSearchClear = useCallback(() => {
    setHomeSearchQuery('');
    setMapApiResults([]);
    setMapSearchSheetOpen(false);
  }, [setHomeSearchQuery, setMapApiResults, setMapSearchSheetOpen]);

  const handleCloseSheet = useCallback(() => {
    setMapSearchSheetOpen(false);
  }, [setMapSearchSheetOpen]);

  const handleSavedPlacePress = useCallback(
    (placeId: string) => {
      setMapSearchSheetOpen(false);
      router.push(`/(main)/place/${placeId}`);
    },
    [router, setMapSearchSheetOpen]
  );

  const handleExternalPress = useCallback(
    (result: MapApiResult) => {
      setMapSearchSheetOpen(false);
      router.push({
        pathname: '/(main)/place/add/search',
        params: {
          externalPlaceId: result.externalPlaceId,
          name: result.name,
          latitude: String(result.latitude),
          longitude: String(result.longitude),
          addressText: result.addressText ?? '',
          category: result.category,
        },
      });
    },
    [router, setMapSearchSheetOpen]
  );

  const handleMarkerPress = useCallback((place: Place) => {
    router.push(`/(main)/place/${place.placeId}`);
  }, [router]);

  const handleAddBySearch = () => {
    setAddMenuVisible(false);
    router.push('/(main)/place/add/search');
  };

  const handleAddByPin = () => {
    setAddMenuVisible(false);
    router.push('/(main)/place/add/pin');
  };

  const handleAddByPhoto = () => {
    setAddMenuVisible(false);
    router.push('/(main)/place/add/photo');
  };

  const hasActiveFilter = filter.status !== 'all' || filter.category !== 'all';

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_MAP_REGION as Region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredPlaces.map((place) => (
          <PlaceMarker key={place.placeId} place={place} onPress={handleMarkerPress} />
        ))}
      </MapView>

      {/* Floating Search Bar */}
      <SafeAreaView edges={['top']} style={styles.searchOverlay}>
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              value={homeSearchQuery}
              onChangeText={handleSearchChange}
              onClear={handleSearchClear}
              placeholder="장소 검색..."
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
      </SafeAreaView>

      {/* FAB - Add Place */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddMenuVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.text.inverse} />
      </TouchableOpacity>

      {/* Add Menu Modal */}
      <Modal visible={addMenuVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setAddMenuVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.addMenu}>
            <Text style={styles.addMenuTitle}>장소 추가</Text>

            <TouchableOpacity style={styles.addMenuItem} onPress={handleAddBySearch}>
              <View style={styles.addMenuIconCircle}>
                <Ionicons name="search" size={22} color={colors.accent.primary} />
              </View>
              <View style={styles.addMenuTextWrap}>
                <Text style={styles.addMenuLabel}>검색으로 추가</Text>
                <Text style={styles.addMenuDesc}>장소를 검색해서 등록</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addMenuItem} onPress={handleAddByPin}>
              <View style={styles.addMenuIconCircle}>
                <Ionicons name="pin-outline" size={22} color={colors.accent.primary} />
              </View>
              <View style={styles.addMenuTextWrap}>
                <Text style={styles.addMenuLabel}>지도에 핀 찍기</Text>
                <Text style={styles.addMenuDesc}>원하는 위치에 직접 표시</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addMenuItem} onPress={handleAddByPhoto}>
              <View style={styles.addMenuIconCircle}>
                <Ionicons name="camera-outline" size={22} color={colors.accent.primary} />
              </View>
              <View style={styles.addMenuTextWrap}>
                <Text style={styles.addMenuLabel}>사진으로 추가</Text>
                <Text style={styles.addMenuDesc}>사진과 함께 방문기록 남기기</Text>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

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

      {/* Search Results Bottom Sheet */}
      <MapSearchResultsSheet
        visible={mapSearchSheetOpen}
        onClose={handleCloseSheet}
        savedPlaces={places}
        externalResults={mapApiResults}
        searchQuery={homeSearchQuery}
        onPlacePress={handleSavedPlacePress}
        onExternalPress={handleExternalPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.canvas,
  },
  map: {
    flex: 1,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[2],
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
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'flex-end',
    padding: layout.screenPaddingH,
    paddingBottom: spacing[10],
  },
  addMenu: {
    backgroundColor: colors.surface.primary,
    borderRadius: radius.xl,
    padding: spacing[6],
  },
  addMenuTitle: {
    ...typography.heading.m,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  addMenuIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMenuTextWrap: {
    flex: 1,
  },
  addMenuLabel: {
    ...typography.title.m,
    color: colors.text.primary,
  },
  addMenuDesc: {
    ...typography.body.s,
    color: colors.text.secondary,
    marginTop: 2,
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
