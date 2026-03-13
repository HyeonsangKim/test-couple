import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, layout, shadow, component } from '@/theme/tokens';
import { Button } from '@/components/ui';
import { AppHeader } from '@/components/common/AppHeader';
import { DEFAULT_MAP_REGION } from '@/constants';
import { useMapCurrentLocation } from '@/hooks/useMapCurrentLocation';

export default function PlaceAddPinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const currentRegionRef = useRef<Region>(DEFAULT_MAP_REGION as Region);
  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const {
    centerToUser,
    handleUserLocationChange,
    hasForegroundPermission,
    isLocating,
  } = useMapCurrentLocation();

  const handleMapPress = (e: {
    nativeEvent: {
      coordinate: {
        latitude: number;
        longitude: number;
      };
    };
  }) => {
    setSelectedCoordinate(e.nativeEvent.coordinate);
  };

  const handleNext = () => {
    if (!selectedCoordinate) {
      return;
    }

    router.push({
      pathname: '/(main)/place/add/photo/create',
      params: {
        initialLatitude: String(selectedCoordinate.latitude),
        initialLongitude: String(selectedCoordinate.longitude),
        allowEmptyImages: '1',
      },
    });
  };

  const handleLocatePress = () => {
    void centerToUser({
      mapRef,
      currentRegion: currentRegionRef.current,
    });
  };

  const bottomInset = Math.max(insets.bottom, spacing[4]);
  const hasSelectedCoordinate = Boolean(selectedCoordinate);

  return (
    <View style={styles.safe}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_MAP_REGION as Region}
        onPress={handleMapPress}
        onRegionChangeComplete={(region) => {
          currentRegionRef.current = region;
        }}
        onUserLocationChange={handleUserLocationChange}
        showsUserLocation={hasForegroundPermission}
        showsMyLocationButton={false}
      >
        {selectedCoordinate ? <Marker coordinate={selectedCoordinate} /> : null}
      </MapView>

      <SafeAreaView style={styles.topOverlay} edges={['top']}>
        <AppHeader title="지도에 핀 찍기" onBack={() => router.back()} />
      </SafeAreaView>

      <TouchableOpacity
        style={[
          styles.locationBtn,
          {
            bottom: bottomInset + component.button.primaryHeight + spacing[4] + spacing[3],
          },
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

      <View style={[styles.nextCtaWrap, { bottom: bottomInset }]}>
        <Button
          title="다음"
          onPress={handleNext}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!hasSelectedCoordinate}
          style={styles.nextCtaButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg.base,
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
    ...shadow.md,
  },
  locationBtnDisabled: {
    opacity: 0.72,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextCtaWrap: {
    position: 'absolute',
    left: layout.screenPaddingH,
    right: layout.screenPaddingH,
  },
  nextCtaButton: {
    ...shadow.lg,
  },
});
