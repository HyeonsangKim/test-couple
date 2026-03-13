import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput as RNTextInput,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker, Region } from 'react-native-maps';
import { format } from 'date-fns';
import { colors, typography, spacing, radius, layout } from '@/theme/tokens';
import { Button, Chip } from '@/components/ui';
import { DatePicker } from '@/components/common/DatePicker';
import { PlaceImageUploadField } from '@/components/place/PlaceImageUploadField';
import { AppHeader } from '@/components/common/AppHeader';
import { BottomCtaBar } from '@/components/settings';
import { createPlaceFromDraft } from '@/services';
import { PlaceAddStatus, PlaceCategory } from '@/types';
import { CATEGORIES, DEFAULT_MAP_REGION } from '@/constants';
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
    allowEmptyImages?: string;
  }>();
  const isPinFlow = params.allowEmptyImages === '1';
  const requiresImage = !isPinFlow;

  const draftImageUrisFromParamsRef = useRef(parseJsonArray<string>(params.imageUris));
  const draftImagesFromParamsRef = useRef(parseJsonArray<DraftPhotoAsset>(params.imageDrafts));
  const initialDraftImageUris = draftImageUrisFromParamsRef.current;
  const initialDraftImages = (
    draftImagesFromParamsRef.current.length > 0
      ? draftImagesFromParamsRef.current
      : initialDraftImageUris.map((uri) => ({
          uri,
          fileName: null,
          latitude: null,
          longitude: null,
        }))
  ).filter((draft) => draft.uri);
  const firstDraftImage = initialDraftImages[0] ?? null;
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
  const [draftImages, setDraftImages] = useState<DraftPhotoAsset[]>(initialDraftImages);
  const [placeName, setPlaceName] = useState(initialNameFallback);
  const [addressText, setAddressText] = useState<string | null>(null);
  const [category, setCategory] = useState<PlaceCategory>('uncategorized');
  const [status, setStatus] = useState<PlaceAddStatus>('visited');
  const [visitDate, setVisitDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [pinCoordinate, setPinCoordinate] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });
  const [loading, setLoading] = useState(false);
  const [isMetadataLoading, setIsMetadataLoading] = useState(
    Boolean(firstDraftImage && firstDraftImage.latitude !== null && firstDraftImage.longitude !== null),
  );
  const shouldShowVisitDate = status === 'visited';

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

  const handleDraftImageUrisChange = (nextUris: string[]) => {
    setDraftImages((current) => {
      const currentByUri = new Map(current.map((image) => [image.uri, image]));
      return nextUris.map(
        (uri) =>
          currentByUri.get(uri) ?? {
            uri,
            fileName: null,
            latitude: null,
            longitude: null,
          },
      );
    });
  };

  const handleSave = async () => {
    if (requiresImage && draftImages.length === 0) {
      Alert.alert('알림', '최소 1장의 사진을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      const place = await createPlaceFromDraft({
        name: placeName.trim(),
        coordinate: {
          latitude: pinCoordinate.latitude,
          longitude: pinCoordinate.longitude,
        },
        addressText,
        category,
        status,
        visitDate,
        imageUris: draftImages.map((image) => image.uri),
        sourceType: 'custom_pin',
      });
      router.replace(`/(main)/place/${place.placeId}`);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : '저장에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="새 장소 생성" onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <PlaceImageUploadField
            imageUris={draftImages.map((image) => image.uri)}
            onChangeImageUris={handleDraftImageUrisChange}
          />
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>카테고리</Text>
          <View style={styles.chipWrap}>
            {CATEGORIES.map((item) => (
              <Chip
                key={item.key}
                label={item.label}
                onPress={() => setCategory(item.key)}
                selected={category === item.key}
                selectionStyle="accent"
                color={item.color}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>상태</Text>
          <View style={styles.chipRow}>
            <Chip
              label="갔다 온 곳"
              selected={status === 'visited'}
              onPress={() => setStatus('visited')}
              selectionStyle="accent"
            />
            <Chip
              label="위시리스트"
              selected={status === 'wishlist'}
              onPress={() => setStatus('wishlist')}
              selectionStyle="accent"
            />
          </View>
        </View>

        {shouldShowVisitDate ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>방문일</Text>
            <DatePicker value={visitDate} onChange={setVisitDate} />
          </View>
        ) : null}

        {!isPinFlow ? (
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
        ) : null}
      </ScrollView>

      <BottomCtaBar>
        <Button
          title="저장"
          onPress={handleSave}
          variant="fill-primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!placeName.trim() || (requiresImage && draftImages.length === 0)}
        />
      </BottomCtaBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.canvas,
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
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  mapContainer: {
    height: 250,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
