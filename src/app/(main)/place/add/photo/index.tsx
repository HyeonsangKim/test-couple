import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, layout } from '@/theme/tokens';
import { Button, IconButton, Card } from '@/components/ui';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { Place } from '@/types';

export default function PlaceAddPhotoScreen() {
  const router = useRouter();
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const places = usePlaceStore((s) => s.places);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUris((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
      }
    } catch {
      Alert.alert('오류', '사진을 선택할 수 없습니다.');
    }
  };

  const removeImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExistingPlace = () => {
    if (imageUris.length === 0) {
      Alert.alert('알림', '사진을 선택해주세요.');
      return;
    }
    if (!selectedPlace) {
      Alert.alert('알림', '장소를 선택해주세요.');
      return;
    }
    // PRD: 기존 장소 선택 시 PG_VISIT_FORM으로 이동
    router.push({
      pathname: '/(main)/visit/form',
      params: {
        placeId: selectedPlace.placeId,
        draftImageUris: JSON.stringify(imageUris),
      },
    });
  };

  const handleNewPlace = () => {
    if (imageUris.length === 0) {
      Alert.alert('알림', '사진을 선택해주세요.');
      return;
    }
    // PRD: 새 장소 생성 시 PG_PLACE_CREATE_FROM_PHOTO로 이동
    router.push({
      pathname: '/(main)/place/add/photo/create',
      params: {
        imageUris: JSON.stringify(imageUris),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-back"
          onPress={() => router.back()}
          size={40}
          backgroundColor={colors.bg.elevated}
          color={colors.text.primary}
        />
        <Text style={styles.headerTitle}>사진으로 추가</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Photo Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>사진 선택</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
            <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
              <Ionicons name="camera-outline" size={24} color={colors.text.tertiary} />
              <Text style={styles.addImageText}>추가</Text>
            </TouchableOpacity>
            {imageUris.map((uri, i) => (
              <View key={i} style={styles.imageThumbContainer}>
                <Image source={{ uri }} style={styles.imageThumb} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(i)}>
                  <Ionicons name="close" size={12} color={colors.text.inverse} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Place Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>장소 선택 (선택사항)</Text>
          <Text style={styles.sectionDesc}>기존 장소에 사진을 추가하거나, 새 장소를 만들 수 있어요</Text>

          {selectedPlace && (
            <Card style={styles.selectedCard}>
              <View style={styles.selectedRow}>
                <Ionicons name="location" size={18} color={colors.accent.primary} />
                <Text style={styles.selectedName}>{selectedPlace.name}</Text>
                <TouchableOpacity onPress={() => setSelectedPlace(null)}>
                  <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
                </TouchableOpacity>
              </View>
            </Card>
          )}

          {!selectedPlace && (
            <FlatList
              data={places.filter((p) => p.status !== 'orphan')}
              keyExtractor={(item) => item.placeId}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.placeItem}
                  onPress={() => setSelectedPlace(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={item.status === 'wishlist' ? 'heart-outline' : 'checkmark-circle-outline'}
                    size={18}
                    color={colors.text.secondary}
                  />
                  <View style={styles.placeItemContent}>
                    <Text style={styles.placeItemName}>{item.name}</Text>
                    {item.addressText && (
                      <Text style={styles.placeItemAddr}>{item.addressText}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {selectedPlace ? (
          <Button
            title="이 장소에 기록 추가"
            onPress={handleExistingPlace}
            variant="primary"
            size="lg"
            fullWidth
            disabled={imageUris.length === 0}
            style={styles.saveBtn}
          />
        ) : (
          <Button
            title="새 장소 생성"
            onPress={handleNewPlace}
            variant="primary"
            size="lg"
            fullWidth
            disabled={imageUris.length === 0}
            style={styles.saveBtn}
          />
        )}
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
  scrollContent: {
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
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border.strong,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  addImageText: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
  imageThumbContainer: { marginRight: spacing[2] },
  imageThumb: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.bg.soft,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCard: {
    marginTop: spacing[2],
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  selectedName: {
    ...typography.title.m,
    color: colors.text.primary,
    flex: 1,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    gap: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.soft,
  },
  placeItemContent: { flex: 1 },
  placeItemName: { ...typography.body.l, color: colors.text.primary },
  placeItemAddr: { ...typography.body.s, color: colors.text.secondary, marginTop: 2 },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.bg.elevated,
  },
  saveBtn: {
    borderRadius: radius.full,
  },
});
