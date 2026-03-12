import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { Button, Chip, TextInput } from '@/components/ui';
import { BackHeader } from '@/components/common/BackHeader';
import { DatePicker } from '@/components/common/DatePicker';
import { PlaceImageUploadField } from '@/components/place/PlaceImageUploadField';
import { createPlaceFromDraft } from '@/services';
import { useMapStore } from '@/stores/useMapStore';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { CATEGORIES, DEFAULT_MAP_REGION } from '@/constants';
import { PlaceAddStatus, PlaceCategory } from '@/types';
import { colors, layout, radius, spacing, typography } from '@/theme/tokens';

const parseParamNumber = (value?: string) => {
  if (!value) {
    return null;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const isPlaceCategory = (value?: string): value is PlaceCategory =>
  Boolean(value && CATEGORIES.some((item) => item.key === value));

export default function PlaceAddSearchConfigureScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    externalPlaceId?: string;
    name?: string;
    latitude?: string;
    longitude?: string;
    addressText?: string;
    category?: string;
  }>();
  const map = useMapStore((s) => s.map);
  const checkDuplicate = usePlaceStore((s) => s.checkDuplicate);

  const coordinate = useMemo(
    () => ({
      latitude: parseParamNumber(params.latitude) ?? DEFAULT_MAP_REGION.latitude,
      longitude: parseParamNumber(params.longitude) ?? DEFAULT_MAP_REGION.longitude,
    }),
    [params.latitude, params.longitude],
  );

  const [name, setName] = useState((params.name ?? '').trim());
  const [category, setCategory] = useState<PlaceCategory>(
    isPlaceCategory(params.category) ? params.category : 'uncategorized',
  );
  const [status, setStatus] = useState<PlaceAddStatus>('wishlist');
  const [visitDate, setVisitDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (loading) {
      return;
    }

    if (!params.externalPlaceId) {
      Alert.alert('오류', '선택한 검색 결과 정보가 부족합니다.');
      return;
    }

    if (map) {
      const duplicate = await checkDuplicate(map.mapId, params.externalPlaceId);
      if (duplicate) {
        Alert.alert('중복 장소', `"${name || params.name || '선택한 장소'}"은 이미 등록되어 있어요.`, [
          { text: '확인' },
          {
            text: '장소 보기',
            onPress: () => router.replace(`/(main)/place/${duplicate.placeId}`),
          },
        ]);
        return;
      }
    }

    setLoading(true);
    try {
      const place = await createPlaceFromDraft({
        name: name.trim(),
        coordinate,
        addressText: params.addressText ?? null,
        category,
        status,
        visitDate,
        imageUris,
        sourceType: 'official',
        externalPlaceId: params.externalPlaceId,
      });
      router.replace(`/(main)/place/${place.placeId}`);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : '장소 저장에 실패했습니다.';
      Alert.alert('오류', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <BackHeader title="검색 결과 설정" onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <TextInput
            label="장소 이름"
            value={name}
            onChangeText={setName}
            placeholder="장소 이름을 입력해주세요"
            maxLength={50}
          />
          {params.addressText ? (
            <Text style={styles.addressText}>{params.addressText}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <PlaceImageUploadField imageUris={imageUris} onChangeImageUris={setImageUris} />
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>방문일</Text>
          <DatePicker value={visitDate} onChange={setVisitDate} />
        </View>

        <View style={styles.ctaSection}>
          <Button
            title="저장"
            onPress={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!name.trim()}
            style={styles.saveBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.canvas,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[8],
  },
  section: {
    marginBottom: spacing[5],
  },
  sectionTitle: {
    ...typography.title.l,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  addressText: {
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
  ctaSection: {
    marginTop: spacing[2],
    marginBottom: spacing[4],
  },
  saveBtn: {
    borderRadius: radius['2xl'],
  },
});
