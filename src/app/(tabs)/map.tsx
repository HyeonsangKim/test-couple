import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import MapView, { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, layout, component } from '@/theme/tokens';
import { PlaceMarker } from '@/components/map/PlaceMarker';
import { AddPlaceFab } from '@/components/place/AddPlaceFab';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useFilteredPlaces } from '@/hooks/useFilteredPlaces';
import { useMapCurrentLocation } from '@/hooks/useMapCurrentLocation';
import { Place, MapApiResult } from '@/types';
import { DEFAULT_MAP_REGION } from '@/constants';
import { FilterBottomSheet } from '@/components/filter/FilterBottomSheet';
import { MapSearchOverlay, MapSearchOverlayHandle } from '@/components/map/MapSearchOverlay';

export default function MapScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);
  const currentRegionRef = useRef<Region>(DEFAULT_MAP_REGION as Region);
  const searchOverlayRef = useRef<MapSearchOverlayHandle>(null);
  const [filterVisible, setFilterVisible] = useState(false);
  const [addMenuVisible, setAddMenuVisible] = useState(false);

  const { filter } = usePlaceStore();
  const filteredPlaces = useFilteredPlaces();
  const {
    centerToUser,
    handleUserLocationChange,
    hasForegroundPermission,
    isLocating,
  } = useMapCurrentLocation();

  // Saved places for deduplication and display in the search panel
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

  const handleLocatePress = useCallback(() => {
    void centerToUser({
      mapRef,
      currentRegion: currentRegionRef.current,
    });
  }, [centerToUser]);

  const floatingButtonMargin = layout.screenPaddingH;
  const fabBottom = floatingButtonMargin;
  const locationBottom = fabBottom + component.button.fab + floatingButtonMargin;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_MAP_REGION as Region}
        onRegionChangeComplete={(region) => {
          currentRegionRef.current = region;
        }}
        onUserLocationChange={handleUserLocationChange}
        showsUserLocation={hasForegroundPermission}
        showsMyLocationButton={false}
      >
        {filteredPlaces.map((place) => (
          <PlaceMarker key={place.placeId} place={place} onPress={handleMarkerPress} />
        ))}
      </MapView>

      <MapSearchOverlay
        ref={searchOverlayRef}
        onExternalPress={handleExternalPress}
        onOpenFilter={() => setFilterVisible(true)}
        onSavedPlacePress={handleSavedPlacePress}
        savedPlaces={places}
        suspended={addMenuVisible}
      />

      {/* Floating Location Button */}
      <TouchableOpacity
        style={[
          styles.locationBtn,
          { bottom: locationBottom },
          isLocating && styles.locationBtnDisabled,
        ]}
        onPress={handleLocatePress}
        activeOpacity={isLocating ? 1 : 0.7}
        disabled={isLocating}
      >
        <Ionicons
          name="locate-outline"
          size={24}
          color={isLocating ? colors.text.tertiary : colors.text.primary}
        />
      </TouchableOpacity>

      <AddPlaceFab
        visible={addMenuVisible}
        bottom={fabBottom}
        onVisibleChange={setAddMenuVisible}
        onBeforeOpen={() => searchOverlayRef.current?.close()}
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
    width: component.button.fab,
    height: component.button.fab,
    borderRadius: component.button.fab / 2,
    backgroundColor: colors.bg.base,
    borderWidth: 1,
    borderColor: colors.line.default,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...shadow.md,
  },
  locationBtnDisabled: {
    opacity: 0.72,
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
