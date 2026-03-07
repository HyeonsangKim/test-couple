import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors, typography, spacing, radius, shadow } from '@/theme/tokens';
import { Button, IconButton } from '@/components/ui';
import { DatePicker } from '@/components/common/DatePicker';
import { useVisitStore } from '@/stores/useVisitStore';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { LIMITS } from '@/constants';
import { format } from 'date-fns';

export default function CreateVisitScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ placeId?: string }>();
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addVisit = useVisitStore((s) => s.addVisit);
  const updatePlace = usePlaceStore((s) => s.updatePlace);
  const places = usePlaceStore((s) => s.places);
  const currentUser = useAuthStore((s) => s.currentUser);

  const placeId = params.placeId;
  const place = placeId ? places.find((p) => p.id === placeId) : null;

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: Math.max(0, LIMITS.MAX_IMAGES_PER_PLACE - imageUris.length),
    });

    if (!result.canceled) {
      setImageUris((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const removeImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!date) {
      Alert.alert('알림', '방문 날짜를 선택해주세요.');
      return;
    }
    if (!placeId || !currentUser) return;

    setLoading(true);
    try {
      const visit = await addVisit({
        placeId,
        date,
        imageUris,
        createdBy: currentUser.id,
      });

      // Auto-transition: wishlist/orphan -> visited
      if (place && (place.status === 'wishlist' || place.status === 'orphan')) {
        await updatePlace(placeId, { status: 'visited' });
      }

      // Set hero image if place has none
      if (place && !place.heroImageUri && imageUris.length > 0) {
        await updatePlace(placeId, { heroImageUri: imageUris[0] });
      }

      router.back();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <IconButton icon="✕" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>방문 기록 작성</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {place && (
          <View style={styles.placeInfo}>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeAddress}>{place.address}</Text>
          </View>
        )}

        <DatePicker value={date} onChange={setDate} label="방문 날짜" />

        <View style={styles.imageSection}>
          <Text style={styles.sectionLabel}>사진 ({imageUris.length}/{LIMITS.MAX_IMAGES_PER_PLACE})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
            <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
              <Text style={styles.addImageIcon}>📷</Text>
              <Text style={styles.addImageText}>추가</Text>
            </TouchableOpacity>
            {imageUris.map((uri, i) => (
              <View key={i} style={styles.imageThumbContainer}>
                <Image source={{ uri }} style={styles.imageThumb} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(i)}>
                  <Text style={styles.removeImageIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="저장"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!placeId}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { ...typography.subtitle, color: colors.text },
  scroll: { flex: 1 },
  content: { padding: spacing.xxl },
  placeInfo: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadow.sm,
  },
  placeName: { ...typography.bodyBold, color: colors.text },
  placeAddress: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  sectionLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  imageSection: { marginTop: spacing.xl },
  imageRow: { flexDirection: 'row' },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  addImageIcon: { fontSize: 24 },
  addImageText: { ...typography.small, color: colors.textTertiary, marginTop: spacing.xs },
  imageThumbContainer: { marginRight: spacing.sm },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.deleteRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageIcon: { color: colors.white, fontSize: 12, fontWeight: '700' },
  footer: {
    padding: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
