import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import MapView, { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, layout, component } from '@/theme/tokens';
import { PlaceMarker } from '@/components/map/PlaceMarker';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useFilteredPlaces } from '@/hooks/useFilteredPlaces';
import { Place, MapApiResult } from '@/types';
import { DEFAULT_MAP_REGION } from '@/constants';
import { FilterBottomSheet } from '@/components/filter/FilterBottomSheet';
import { MapSearchOverlay, MapSearchOverlayHandle } from '@/components/map/MapSearchOverlay';

export default function MapScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const searchOverlayRef = useRef<MapSearchOverlayHandle>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [addMenuVisible, setAddMenuVisible] = useState(false);

  const { filter } = usePlaceStore();
  const filteredPlaces = useFilteredPlaces();

  // Saved places for deduplication and display in the sheet
  const { places } = usePlaceStore();

  const handleSavedPlacePress = useCallback(
    (placeId: string) => {
      router.push(`/(main)/place/${placeId}`);
    },
    [router]
  );

  const handleExternalPress = useCallback(
    (result: MapApiResult) => {
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
    [router]
  );

  const handleMarkerPress = useCallback((place: Place) => {
    router.push(`/(main)/place/${place.placeId}`);
  }, [router]);

  useEffect(() => {
    const tabNavigation = navigation.getParent();

    if (!tabNavigation) return undefined;

    return tabNavigation.addListener('state', () => {
      const state = tabNavigation.getState();
      const activeRoute = state.routes[state.index]?.name;

      if (activeRoute !== 'map') {
        searchOverlayRef.current?.reset();
      }
    });
  }, [navigation]);

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

  const handleOpenAddMenu = () => {
    searchOverlayRef.current?.close();
    setAddMenuVisible(true);
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

      <MapSearchOverlay
        ref={searchOverlayRef}
        isFilterActive={hasActiveFilter}
        onExternalPress={handleExternalPress}
        onOpenFilter={() => setFilterVisible(true)}
        onSavedPlacePress={handleSavedPlacePress}
        savedPlaces={places}
        suspended={addMenuVisible}
      />

      {/* Floating Location Button */}
      <TouchableOpacity
        style={styles.locationBtn}
        onPress={() => {
          // Show user location on map
          mapRef.current?.animateToRegion(DEFAULT_MAP_REGION as Region, 300);
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="locate-outline" size={22} color={colors.text.primary} />
      </TouchableOpacity>

      {/* FAB - Add Place */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleOpenAddMenu}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.text.inverse} />
      </TouchableOpacity>

      {/* Add Menu Bottom Sheet Modal */}
      <Modal visible={addMenuVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setAddMenuVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.addMenu}>
            {/* Handle bar */}
            <View style={styles.handleBar} />

            <Text style={styles.addMenuTitle}>장소 추가</Text>

            <TouchableOpacity style={styles.addMenuItem} onPress={handleAddBySearch}>
              <View style={styles.addMenuIconCircle}>
                <Ionicons name="search" size={20} color={colors.accent.primary} />
              </View>
              <View style={styles.addMenuTextWrap}>
                <Text style={styles.addMenuLabel}>검색으로 추가</Text>
                <Text style={styles.addMenuDesc}>장소를 검색해서 등록</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addMenuItem} onPress={handleAddByPin}>
              <View style={styles.addMenuIconCircle}>
                <Ionicons name="pin-outline" size={20} color={colors.accent.primary} />
              </View>
              <View style={styles.addMenuTextWrap}>
                <Text style={styles.addMenuLabel}>지도에 핀 찍기</Text>
                <Text style={styles.addMenuDesc}>원하는 위치에 직접 표시</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addMenuItem} onPress={handleAddByPhoto}>
              <View style={styles.addMenuIconCircle}>
                <Ionicons name="camera-outline" size={20} color={colors.accent.primary} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  map: {
    flex: 1,
  },
  locationBtn: {
    position: 'absolute',
    right: layout.screenPaddingH,
    top: 160,
    width: component.button.floatingIcon,
    height: component.button.floatingIcon,
    borderRadius: radius.xl,
    backgroundColor: colors.bg.base,
    borderWidth: 1,
    borderColor: colors.line.default,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...shadow.sm,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: layout.screenPaddingH,
    width: component.button.fab,
    height: component.button.fab,
    borderRadius: 28,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    ...shadow.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'flex-end',
  },
  addMenu: {
    backgroundColor: colors.bg.base,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[10],
  },
  handleBar: {
    width: component.sheet.handleWidth,
    height: component.sheet.handleHeight,
    borderRadius: radius.full,
    backgroundColor: colors.border.strong,
    alignSelf: 'center',
    marginTop: component.sheet.topPadding,
    marginBottom: spacing[3],
  },
  addMenuTitle: {
    ...typography.heading.m,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: component.actionSheetRow.height,
    gap: spacing[3],
  },
  addMenuIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg.soft,
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
    backgroundColor: colors.bg.base,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
});
