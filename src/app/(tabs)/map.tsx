import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text, Alert } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadow, layout, component } from '@/theme/tokens';
import { PlaceMarker } from '@/components/map/PlaceMarker';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useFilteredPlaces } from '@/hooks/useFilteredPlaces';
import { useMapCurrentLocation } from '@/hooks/useMapCurrentLocation';
import { Place, MapApiResult } from '@/types';
import { DEFAULT_MAP_REGION, LIMITS } from '@/constants';
import { FilterBottomSheet } from '@/components/filter/FilterBottomSheet';
import { MapSearchOverlay, MapSearchOverlayHandle } from '@/components/map/MapSearchOverlay';
import { serializePickedAsset } from '@/utils/photoMetadata';

export default function MapScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
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
    setTimeout(async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          quality: 0.8,
          exif: true,
          selectionLimit: LIMITS.MAX_IMAGES_PER_PLACE,
        });

        if (result.canceled) {
          return;
        }

        const draftImages = result.assets.map(serializePickedAsset);
        const imageUris = draftImages.map((image) => image.uri);

        router.push({
          pathname: '/(main)/place/add/photo/create',
          params: {
            imageUris: JSON.stringify(imageUris),
            imageDrafts: JSON.stringify(draftImages),
          },
        });
      } catch {
        Alert.alert('오류', '사진을 선택할 수 없습니다.');
      }
    }, 180);
  };

  const handleOpenAddMenu = () => {
    searchOverlayRef.current?.close();
    setAddMenuVisible(true);
  };

  const handleLocatePress = useCallback(() => {
    void centerToUser({
      mapRef,
      currentRegion: currentRegionRef.current,
    });
  }, [centerToUser]);

  const floatingButtonMargin = layout.screenPaddingH;
  const fabBottom = floatingButtonMargin;
  const locationBottom = fabBottom + component.button.fab + floatingButtonMargin;
  const addMenuOptions = [
    {
      key: 'search',
      icon: 'search' as const,
      title: '검색으로 추가',
      description: '장소 이름이나 검색 결과를 선택해 바로 저장',
      onPress: handleAddBySearch,
    },
    {
      key: 'pin',
      icon: 'pin-outline' as const,
      title: '지도에 핀 찍기',
      description: '원하는 위치를 직접 지정해서 커스텀 장소 만들기',
      onPress: handleAddByPin,
    },
    {
      key: 'photo',
      icon: 'camera-outline' as const,
      title: '사진으로 추가',
      description: '사진과 함께 방문 기록을 남기며 장소 추가',
      onPress: handleAddByPhoto,
    },
  ];

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

      {/* FAB - Add Place */}
      <TouchableOpacity
        style={[styles.fab, { bottom: fabBottom }]}
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
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.addMenu, { paddingBottom: Math.max(insets.bottom, spacing[6]) }]}
          >
            {/* Handle bar */}
            <View style={styles.handleBar} />

            <View style={styles.addMenuHeader}>
              <Text style={styles.addMenuTitle}>장소 추가</Text>
            </View>

            <Text style={styles.addMenuSectionLabel}>추가 방식</Text>
            <View style={styles.addMenuList}>
              {addMenuOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={styles.addMenuItem}
                  onPress={option.onPress}
                  activeOpacity={0.8}
                >
                  <View style={styles.addMenuIconFrame}>
                    <Ionicons name={option.icon} size={18} color={colors.text.secondary} />
                  </View>
                  <View style={styles.addMenuTextBlock}>
                    <Text style={styles.addMenuLabel}>{option.title}</Text>
                    <Text style={styles.addMenuDesc}>{option.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addMenuDismiss}
              onPress={() => setAddMenuVisible(false)}
              activeOpacity={0.75}
            >
              <Text style={styles.addMenuDismissText}>닫기</Text>
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
  fab: {
    position: 'absolute',
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
    backgroundColor: colors.bg.sheet,
    borderTopLeftRadius: component.sheet.topRadius,
    borderTopRightRadius: component.sheet.topRadius,
    paddingHorizontal: component.sheet.innerHorizontalPadding,
    paddingTop: component.sheet.topPadding,
  },
  handleBar: {
    width: component.sheet.handleWidth,
    height: component.sheet.handleHeight,
    borderRadius: component.sheet.handleHeight / 2,
    backgroundColor: colors.line.strong,
    alignSelf: 'center',
    marginBottom: spacing[3],
  },
  addMenuHeader: {
    marginBottom: spacing[5],
  },
  addMenuTitle: {
    ...typography.title.l,
    color: colors.text.primary,
  },
  addMenuSectionLabel: {
    ...typography.body.m,
    color: colors.text.tertiary,
    marginBottom: spacing[3],
  },
  addMenuList: {
    gap: spacing[3],
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: component.settingsRow.heightComfortable,
    backgroundColor: colors.bg.subtle,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  addMenuIconFrame: {
    width: component.settingsRow.iconFrame,
    height: component.settingsRow.iconFrame,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMenuTextBlock: {
    flex: 1,
    gap: spacing[1],
  },
  addMenuLabel: {
    ...typography.body.l,
    color: colors.text.primary,
  },
  addMenuDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  addMenuDismiss: {
    marginTop: spacing[5],
    minHeight: component.settingsRow.height,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.bg.subtle,
  },
  addMenuDismissText: {
    ...typography.body.l,
    color: colors.text.secondary,
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
