import React, { useState, useRef } from 'react';
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
import MapView, { Marker, Region } from 'react-native-maps';
import { colors, typography, spacing, radius, layout } from '@/theme/tokens';
import { Button, IconButton, Card } from '@/components/ui';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useMapStore } from '@/stores/useMapStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { validatePlaceName } from '@/utils/validation';
import { DEFAULT_MAP_REGION } from '@/constants';
import { format } from 'date-fns';

export default function PlaceCreateFromPhotoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    imageUris?: string;
    initialLatitude?: string;
    initialLongitude?: string;
  }>();

  const draftImageUris: string[] = params.imageUris
    ? JSON.parse(params.imageUris)
    : [];

  const initialLat = params.initialLatitude
    ? parseFloat(params.initialLatitude)
    : DEFAULT_MAP_REGION.latitude;
  const initialLng = params.initialLongitude
    ? parseFloat(params.initialLongitude)
    : DEFAULT_MAP_REGION.longitude;

  const mapRef = useRef<MapView>(null);
  const [placeName, setPlaceName] = useState('');
  const [pinCoordinate, setPinCoordinate] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });
  const [loading, setLoading] = useState(false);

  const addPlace = usePlaceStore((s) => s.addPlace);
  const updatePlace = usePlaceStore((s) => s.updatePlace);
  const addVisit = useVisitStore((s) => s.addVisit);
  const addImages = useVisitStore((s) => s.addImages);
  const map = useMapStore((s) => s.map);
  const currentUser = useAuthStore((s) => s.currentUser);

  const handleMapPress = (e: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    setPinCoordinate(e.nativeEvent.coordinate);
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
      // 1. Create new place
      const place = await addPlace({
        name: placeName.trim(),
        latitude: pinCoordinate.latitude,
        longitude: pinCoordinate.longitude,
        mapId: map.mapId,
        createdByUserId: currentUser.userId,
        sourceType: 'custom_pin',
      });

      // 2. Create first visit (PRD: 신규 장소 저장과 동시에 첫 방문기록이 생성된다)
      const visit = await addVisit({
        placeId: place.placeId,
        visitDate: format(new Date(), 'yyyy-MM-dd'),
        createdByUserId: currentUser.userId,
      });

      // 3. Add images to the visit
      if (draftImageUris.length > 0) {
        await addImages(
          draftImageUris.map((uri) => ({ visitId: visit.visitId, uri })),
        );
      }

      // 4. Set first image as hero (PRD: 첫 이미지는 자동으로 대표 이미지가 된다)
      if (draftImageUris.length > 0) {
        await updatePlace(place.placeId, {
          heroImageId: `img_${visit.visitId}_0`,
          status: 'visited',
        });
      }

      // Navigate to place detail (PRD: 저장 완료 시 PG_PLACE_DETAIL(placeId))
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
          backgroundColor={colors.surface.primary}
          color={colors.text.primary}
        />
        <Text style={styles.headerTitle}>새 장소 생성</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
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
            onChangeText={setPlaceName}
            placeholder="장소 이름을 입력해주세요"
            placeholderTextColor={colors.text.tertiary}
            maxLength={50}
          />
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
                onDragEnd={(e) => setPinCoordinate(e.nativeEvent.coordinate)}
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
    backgroundColor: colors.surface.tertiary,
    marginRight: spacing[2],
  },
  nameInput: {
    ...typography.body.l,
    color: colors.text.primary,
    backgroundColor: colors.surface.primary,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.border.soft,
  },
  mapContainer: {
    height: 250,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.surface.primary,
  },
  saveBtn: {
    borderRadius: radius.pill,
  },
});
