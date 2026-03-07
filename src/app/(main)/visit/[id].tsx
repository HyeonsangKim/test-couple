import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { Button, IconButton } from '@/components/ui';
import { DatePicker } from '@/components/common/DatePicker';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useVisitStore } from '@/stores/useVisitStore';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { LIMITS } from '@/constants';
import { visitService } from '@/services/visitService';
import { VisitRecord } from '@/types';

export default function EditVisitScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [visit, setVisit] = useState<VisitRecord | null>(null);
  const [date, setDate] = useState('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateVisit = useVisitStore((s) => s.updateVisit);
  const deleteVisitAction = useVisitStore((s) => s.deleteVisit);
  const updatePlace = usePlaceStore((s) => s.updatePlace);
  const places = usePlaceStore((s) => s.places);
  const visits = useVisitStore((s) => s.visits);

  useEffect(() => {
    if (id) {
      visitService.getVisitById(id).then((v) => {
        if (v) {
          setVisit(v);
          setDate(v.date);
          setImageUris([...v.imageUris]);
        }
      });
    }
  }, [id]);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUris((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const removeImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!id || !visit) return;
    setLoading(true);
    try {
      await updateVisit(id, { date, imageUris });
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !visit) return;
    setShowDeleteConfirm(false);
    await deleteVisitAction(id);

    // Check if this was the last visit for the place → set to orphan
    const remainingVisits = visits.filter((v) => v.placeId === visit.placeId && v.id !== id);
    if (remainingVisits.length === 0) {
      const place = places.find((p) => p.id === visit.placeId);
      if (place && place.status === 'visited') {
        await updatePlace(visit.placeId, { status: 'orphan' });
      }
    }

    router.back();
  };

  if (!visit) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <IconButton icon="close" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>방문 기록 수정</Text>
        <TouchableOpacity onPress={() => setShowDeleteConfirm(true)}>
          <Text style={styles.deleteBtn}>삭제</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <DatePicker value={date} onChange={setDate} label="방문 날짜" />

        <View style={styles.imageSection}>
          <Text style={styles.sectionLabel}>사진 ({imageUris.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
              <Ionicons name="camera-outline" size={24} color={colors.textTertiary} />
              <Text style={styles.addImageText}>추가</Text>
            </TouchableOpacity>
            {imageUris.map((uri, i) => (
              <View key={i} style={styles.imageThumbContainer}>
                <Image source={{ uri }} style={styles.imageThumb} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(i)}>
                  <Ionicons name="close" size={12} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="저장" onPress={handleSave} variant="primary" size="lg" fullWidth loading={loading} />
      </View>

      <ConfirmModal
        visible={showDeleteConfirm}
        title="방문 기록 삭제"
        message="이 방문 기록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        danger
      />
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
  deleteBtn: { ...typography.bodyBold, color: colors.deleteRed },
  scroll: { flex: 1 },
  content: { padding: spacing.xxl },
  sectionLabel: { ...typography.captionBold, color: colors.textSecondary, marginBottom: spacing.md },
  imageSection: { marginTop: spacing.xl },
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
  footer: {
    padding: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
