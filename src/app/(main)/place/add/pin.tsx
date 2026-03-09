import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import { colors, typography, spacing, radius, shadow, layout } from '@/theme/tokens';
import { Button, IconButton } from '@/components/ui';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useMapStore } from '@/stores/useMapStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { validatePlaceName } from '@/utils/validation';
import { DEFAULT_MAP_REGION } from '@/constants';

export default function PlaceAddPinScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [pinCoordinate, setPinCoordinate] = useState({
    latitude: DEFAULT_MAP_REGION.latitude,
    longitude: DEFAULT_MAP_REGION.longitude,
  });
  const [placeName, setPlaceName] = useState('');
  const [loading, setLoading] = useState(false);

  const addPlace = usePlaceStore((s) => s.addPlace);
  const map = useMapStore((s) => s.map);
  const currentUser = useAuthStore((s) => s.currentUser);

  const handleMapPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
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
      const place = await addPlace({
        name: placeName.trim(),
        latitude: pinCoordinate.latitude,
        longitude: pinCoordinate.longitude,
        mapId: map.mapId,
        createdByUserId: currentUser.userId,
        sourceType: 'custom_pin',
      });
      Alert.alert('추가 완료', `"${placeName.trim()}"이 저장되었습니다.`, [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('오류', '장소 추가에 실패했습니다.');
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
        <Text style={styles.headerTitle}>지도에 핀 찍기</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={DEFAULT_MAP_REGION as Region}
          onPress={handleMapPress}
          showsUserLocation
        >
          <Marker
            coordinate={pinCoordinate}
            draggable
            onDragEnd={(e) => setPinCoordinate(e.nativeEvent.coordinate)}
          />
        </MapView>
        <Text style={styles.mapHint}>지도를 탭하거나 핀을 드래그해서 위치를 지정하세요</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>장소 이름</Text>
        <RNTextInput
          style={styles.nameInput}
          value={placeName}
          onChangeText={setPlaceName}
          placeholder="장소 이름을 입력해주세요"
          placeholderTextColor={colors.text.tertiary}
          maxLength={50}
        />
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
  mapContainer: {
    flex: 1,
    marginHorizontal: layout.screenPaddingH,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  map: {
    flex: 1,
  },
  mapHint: {
    ...typography.body.s,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingVertical: spacing[2],
    backgroundColor: colors.surface.primary,
  },
  inputSection: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[8],
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
    backgroundColor: colors.surface.primary,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.border.soft,
    marginBottom: spacing[4],
  },
  saveBtn: {
    borderRadius: radius.pill,
  },
});
