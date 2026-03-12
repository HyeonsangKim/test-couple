import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput as RNTextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';
import { colors, typography, spacing, radius, layout } from '@/theme/tokens';
import { Button, IconButton } from '@/components/ui';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useMapStore } from '@/stores/useMapStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { validatePlaceName } from '@/utils/validation';
import { DEFAULT_MAP_REGION } from '@/constants';
import { format } from 'date-fns';
import {
  buildAddressText,
  buildSuggestedPlaceName,
  DraftPhotoAsset,
  getDraftPhotoNameFallback,
} from '@/utils/photoMetadata';

const parseJsonArray = <T,>(value?: string) => {
  if (!value) {
    return [] as T[];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [] as T[];
  }
};

const parseParamNumber = (value?: string) => {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function PlaceCreateFromPhotoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    imageUris?: string;
    imageDrafts?: string;
    initialLatitude?: string;
    initialLongitude?: string;
  }>();

  const draftImageUrisRef = useRef(parseJsonArray<string>(params.imageUris));
  const draftImagesFromParamsRef = useRef(parseJsonArray<DraftPhotoAsset>(params.imageDrafts));
  const draftImageUris = draftImageUrisRef.current;
  const draftImagesFromParams = draftImagesFromParamsRef.current;
  const draftImages =
    draftImagesFromParams.length > 0
      ? draftImagesFromParams
      : draftImageUris.map((uri) => ({
          uri,
          fileName: null,
          latitude: null,
          longitude: null,
        }));
  const firstDraftImage = draftImages[0] ?? null;
  const initialLat =
    parseParamNumber(params.initialLatitude) ??
    firstDraftImage?.latitude ??
    DEFAULT_MAP_REGION.latitude;
  const initialLng =
    parseParamNumber(params.initialLongitude) ??
    firstDraftImage?.longitude ??
    DEFAULT_MAP_REGION.longitude;
  const initialNameFallback = getDraftPhotoNameFallback(firstDraftImage);

  const mapRef = useRef<MapView>(null);
  const placeNameEditedRef = useRef(false);
  const geocodeRequestRef = useRef(0);
  const [placeName, setPlaceName] = useState(initialNameFallback);
  const [addressText, setAddressText] = useState<string | null>(null);
  const [pinCoordinate, setPinCoordinate] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });
  const [loading, setLoading] = useState(false);
  const [isMetadataLoading, setIsMetadataLoading] = useState(
    firstDraftImage?.latitude !== null && firstDraftImage?.longitude !== null,
  );

  const addPlace = usePlaceStore((s) => s.addPlace);
  const updatePlace = usePlaceStore((s) => s.updatePlace);
  const addVisit = useVisitStore((s) => s.addVisit);
  const addImages = useVisitStore((s) => s.addImages);
  const map = useMapStore((s) => s.map);
  const currentUser = useAuthStore((s) => s.currentUser);

  const resolveLocationDetails = async (
    coordinate: { latitude: number; longitude: number },
    syncPlaceName: boolean,
  ) => {
    const requestId = geocodeRequestRef.current + 1;
    geocodeRequestRef.current = requestId;
    setIsMetadataLoading(true);
    setAddressText(null);

    try {
      const results = await Location.reverseGeocodeAsync(coordinate);

      if (geocodeRequestRef.current !== requestId) {
        return;
      }

      const primaryAddress = results[0];
      const nextAddress = buildAddressText(primaryAddress);
      const fallbackName = getDraftPhotoNameFallback(firstDraftImage);

      setAddressText(nextAddress || null);

      if (syncPlaceName && !placeNameEditedRef.current) {
        const nextPlaceName = buildSuggestedPlaceName(primaryAddress, fallbackName);
        if (nextPlaceName) {
          setPlaceName(nextPlaceName);
        }
      }
    } catch {
      if (geocodeRequestRef.current !== requestId) {
        return;
      }

      if (syncPlaceName && !placeNameEditedRef.current) {
        const fallbackName = getDraftPhotoNameFallback(firstDraftImage);
        if (fallbackName) {
          setPlaceName(fallbackName);
        }
      }
    } finally {
      if (geocodeRequestRef.current === requestId) {
        setIsMetadataLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!firstDraftImage) {
      return;
    }

    const fallbackName = getDraftPhotoNameFallback(firstDraftImage);
    if (fallbackName && !placeNameEditedRef.current) {
      setPlaceName((current) => (current.trim() ? current : fallbackName));
    }

    if (firstDraftImage.latitude === null || firstDraftImage.longitude === null) {
      setIsMetadataLoading(false);
      return;
    }

    setPinCoordinate({
      latitude: firstDraftImage.latitude,
      longitude: firstDraftImage.longitude,
    });
    void resolveLocationDetails(
      {
        latitude: firstDraftImage.latitude,
        longitude: firstDraftImage.longitude,
      },
      true,
    );
  }, []);

  const handleMapPress = (e: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const nextCoordinate = e.nativeEvent.coordinate;
    setPinCoordinate(nextCoordinate);
    void resolveLocationDetails(nextCoordinate, false);
  };

  const handleSave = async () => {
    const nameError = validatePlaceName(placeName);
    if (nameError) {
      Alert.alert('알림', nameError);
      return;
    }
    if (!map || !currentUser) return;

    setLoading(true);
    try {
      const place = await addPlace({
        name: placeName.trim(),
        latitude: pinCoordinate.latitude,
        longitude: pinCoordinate.longitude,
        addressText,
        mapId: map.mapId,
        createdByUserId: currentUser.userId,
        sourceType: 'custom_pin',
      });

      const visit = await addVisit({
        placeId: place.placeId,
        visitDate: format(new Date(), 'yyyy-MM-dd'),
        createdByUserId: currentUser.userId,
      });

      let createdImages: { imageId: string }[] = [];
      if (draftImageUris.length > 0) {
        createdImages = await addImages(
          draftImageUris.map((uri) => ({ visitId: visit.visitId, uri })),
        );
      }

      if (createdImages.length > 0) {
        await updatePlace(place.placeId, {
          heroImageId: createdImages[0].imageId,
          status: 'visited',
        });
      }

      router.replace(`/(main)/place/${place.placeId}`);
    } catch {
      Alert.alert('오류', '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-back"
          onPress={() => router.back()}
          size={40}
          backgroundColor={colors.bg.elevated}
          color={colors.text.primary}
        />
        <Text style={styles.headerTitle}>새 장소 생성</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Draft Image Preview */}
        {draftImageUris.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>선택한 사진</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageRow}
            >
              {draftImageUris.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.imageThumb} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Place Name Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>장소 이름</Text>
          <RNTextInput
            style={styles.nameInput}
            value={placeName}
            onChangeText={(value) => {
              placeNameEditedRef.current = true;
              setPlaceName(value);
            }}
            placeholder="장소 이름을 입력해주세요"
            placeholderTextColor={colors.text.tertiary}
            maxLength={50}
            showSoftInputOnFocus
          />
          {(isMetadataLoading || addressText || initialNameFallback) ? (
            <Text style={styles.metaHint}>
              {isMetadataLoading
                ? '첫 사진 메타데이터에서 위치와 이름을 불러오는 중이에요.'
                : addressText
                  ? `첫 사진 메타데이터 기준 위치: ${addressText}`
                  : '첫 사진 메타데이터를 기준으로 초깃값을 채웠어요.'}
            </Text>
          ) : null}
        </View>

        {/* Map for Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>위치 지정</Text>
          <Text style={styles.sectionDesc}>
            지도를 탭하거나 핀을 드래그해서 위치를 지정하세요
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                ...pinCoordinate,
                latitudeDelta: DEFAULT_MAP_REGION.latitudeDelta,
                longitudeDelta: DEFAULT_MAP_REGION.longitudeDelta,
              } as Region}
              onPress={handleMapPress}
              showsUserLocation
            >
              <Marker
                coordinate={pinCoordinate}
                draggable
                onDragEnd={(e) => {
                  const nextCoordinate = e.nativeEvent.coordinate;
                  setPinCoordinate(nextCoordinate);
                  void resolveLocationDetails(nextCoordinate, false);
                }}
              />
            </MapView>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="저장"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!placeName.trim()}
          style={styles.saveBtn}
        />
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
  },
  headerTitle: {
    ...typography.title.l,
    color: colors.text.primary,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[10],
  },
  section: {
    marginBottom: layout.sectionGap,
  },
  sectionTitle: {
    ...typography.title.l,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  sectionDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: spacing[2],
  },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.bg.soft,
    marginRight: spacing[2],
  },
  nameInput: {
    ...typography.body.l,
    color: colors.text.primary,
    backgroundColor: colors.bg.soft,
    borderRadius: radius.lg,
    height: 56,
    paddingHorizontal: spacing[4],
  },
  metaHint: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing[2],
  },
  mapContainer: {
    height: 250,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.bg.elevated,
  },
  saveBtn: {
    borderRadius: radius['2xl'],
  },
});
