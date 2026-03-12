import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput as RNTextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { format } from 'date-fns';
import MapView, { Marker, Region } from 'react-native-maps';
import { colors, typography, spacing, radius, layout, shadow } from '@/theme/tokens';
import { Button, Chip, IconButton } from '@/components/ui';
import { DatePicker } from '@/components/common/DatePicker';
import { PlaceImageUploadField } from '@/components/place/PlaceImageUploadField';
import { createPlaceFromDraft } from '@/services';
import { PlaceAddStatus, PlaceCategory } from '@/types';
import { CATEGORIES, DEFAULT_MAP_REGION } from '@/constants';
import { buildAddressText } from '@/utils/photoMetadata';

export default function PlaceAddPinScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const geocodeRequestRef = useRef(0);
  const [pinCoordinate, setPinCoordinate] = useState({
    latitude: DEFAULT_MAP_REGION.latitude,
    longitude: DEFAULT_MAP_REGION.longitude,
  });
  const [placeName, setPlaceName] = useState('');
  const [category, setCategory] = useState<PlaceCategory>('uncategorized');
  const [status, setStatus] = useState<PlaceAddStatus>('wishlist');
  const [visitDate, setVisitDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [addressText, setAddressText] = useState<string | null>(null);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const resolveAddress = async (coordinate: { latitude: number; longitude: number }) => {
    const requestId = geocodeRequestRef.current + 1;
    geocodeRequestRef.current = requestId;
    setAddressLoading(true);
    setAddressText(null);

    try {
      const results = await Location.reverseGeocodeAsync(coordinate);

      if (geocodeRequestRef.current !== requestId) {
        return;
      }

      const nextAddress = buildAddressText(results[0]);
      setAddressText(nextAddress || null);
    } catch {
      if (geocodeRequestRef.current !== requestId) {
        return;
      }
      setAddressText(null);
    } finally {
      if (geocodeRequestRef.current === requestId) {
        setAddressLoading(false);
      }
    }
  };

  const handleMapPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const coordinate = e.nativeEvent.coordinate;
    setPinCoordinate(coordinate);
    void resolveAddress(coordinate);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const place = await createPlaceFromDraft({
        name: placeName.trim(),
        coordinate: pinCoordinate,
        addressText,
        category,
        status,
        visitDate,
        imageUris,
        sourceType: 'custom_pin',
      });
      router.replace(`/(main)/place/${place.placeId}`);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : '장소 추가에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safe}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_MAP_REGION as Region}
        onPress={handleMapPress}
        showsUserLocation
      >
        <Marker coordinate={pinCoordinate} />
      </MapView>

      <SafeAreaView pointerEvents="box-none" style={styles.topOverlay} edges={['top']}>
        <View style={styles.header}>
          <IconButton
            icon="chevron-back"
            onPress={() => router.back()}
            size={40}
            backgroundColor={colors.bg.elevated}
            color={colors.text.primary}
          />
          <Text style={styles.headerTitle}>지도에 핀 찍기</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <View style={[styles.bottomPanel, { paddingBottom: Math.max(insets.bottom, spacing[4]) }]}>
        <ScrollView
          style={styles.bottomPanelScroll}
          contentContainerStyle={styles.bottomPanelContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.mapHint}>지도를 탭해서 위치를 지정하세요</Text>
          <Text style={styles.inputLabel}>장소 이름</Text>
          <RNTextInput
            style={styles.nameInput}
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="장소 이름을 입력해주세요"
            placeholderTextColor={colors.text.tertiary}
            maxLength={50}
            showSoftInputOnFocus
          />
          {addressLoading || addressText ? (
            <Text style={styles.addressHint}>
              {addressLoading ? '주소를 불러오는 중이에요.' : addressText}
            </Text>
          ) : null}

          <PlaceImageUploadField
            imageUris={imageUris}
            onChangeImageUris={setImageUris}
            style={styles.imageField}
          />

          <Text style={styles.inputLabel}>카테고리</Text>
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

          <Text style={styles.inputLabel}>상태</Text>
          <View style={styles.statusRow}>
            <Chip
              label="위시리스트"
              selected={status === 'wishlist'}
              onPress={() => setStatus('wishlist')}
              selectionStyle="accent"
            />
            <Chip
              label="갔다 온 곳"
              selected={status === 'visited'}
              onPress={() => setStatus('visited')}
              selectionStyle="accent"
            />
          </View>

          <Text style={styles.inputLabel}>방문일</Text>
          <DatePicker value={visitDate} onChange={setVisitDate} />

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
        </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[2],
    paddingBottom: spacing[3],
  },
  headerTitle: {
    ...typography.title.l,
    color: colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  bottomPanel: {
    position: 'absolute',
    left: layout.screenPaddingH,
    right: layout.screenPaddingH,
    bottom: spacing[3],
    maxHeight: '78%',
    backgroundColor: colors.bg.sheet,
    borderRadius: radius.xl,
    paddingTop: spacing[4],
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.line.default,
    ...shadow.md,
  },
  bottomPanelScroll: {
    flexGrow: 0,
  },
  bottomPanelContent: {
    paddingBottom: spacing[2],
  },
  mapHint: {
    ...typography.body.s,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },
  inputLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  nameInput: {
    ...typography.body.l,
    color: colors.text.primary,
    backgroundColor: colors.bg.soft,
    borderRadius: radius.lg,
    height: 56,
    paddingHorizontal: spacing[4],
  },
  addressHint: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing[2],
    marginBottom: spacing[1],
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  imageField: {
    marginBottom: spacing[3],
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing[2],
    marginBottom: spacing[3],
  },
  saveBtn: {
    marginTop: spacing[4],
    borderRadius: radius.full,
  },
});
