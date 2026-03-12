import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, radius, layout } from "@/theme/tokens";
import { Button, IconButton, Card } from "@/components/ui";
import { DatePicker } from "@/components/common/DatePicker";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useVisitStore } from "@/stores/useVisitStore";
import { usePlaceStore } from "@/stores/usePlaceStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { LIMITS } from "@/constants";
import { format } from "date-fns";
import { visitService } from "@/services/visitService";
import { Visit } from "@/types";

interface DraftImage {
  key: string;
  uri: string;
  imageId: string | null;
  isNew: boolean;
}

const parseStringArray = (value?: string): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

export default function VisitFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    placeId?: string;
    visitId?: string;
    draftImageUris?: string;
  }>();

  const isEditMode = !!params.visitId;
  const placeId = params.placeId;
  const visitId = params.visitId;
  const draftImageUrisRef = useRef<string[]>(
    parseStringArray(params.draftImageUris),
  );
  const initialExistingImageIdsRef = useRef<string[]>([]);

  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [draftImages, setDraftImages] = useState<DraftImage[]>(
    draftImageUrisRef.current.map((uri, index) => ({
      key: `new-${index}-${uri}`,
      uri,
      imageId: null,
      isNew: true,
    })),
  );
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [existingVisit, setExistingVisit] = useState<Visit | null>(null);

  const { addVisit, updateVisit, deleteVisit, addImages } = useVisitStore();
  const updatePlace = usePlaceStore((s) => s.updatePlace);
  const places = usePlaceStore((s) => s.places);
  const visits = useVisitStore((s) => s.visits);
  const currentUser = useAuthStore((s) => s.currentUser);

  const place = placeId ? places.find((p) => p.placeId === placeId) : null;

  useEffect(() => {
    if (isEditMode && visitId) {
      visitService.getVisitById(visitId).then((v) => {
        if (v) {
          setExistingVisit(v);
          setDate(v.visitDate);
          visitService.getImagesByVisit(visitId).then((imgs) => {
            initialExistingImageIdsRef.current = imgs.map((img) => img.imageId);
            setDraftImages(
              imgs.map((img) => ({
                key: `existing-${img.imageId}`,
                uri: img.uri,
                imageId: img.imageId,
                isNew: false,
              })),
            );
          });
        }
      });
    }
  }, [isEditMode, visitId]);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: Math.max(
          0,
          LIMITS.MAX_IMAGES_PER_PLACE - draftImages.length,
        ),
      });

      if (!result.canceled) {
        setDraftImages((prev) => [
          ...prev,
          ...result.assets.map((asset, index) => ({
            key: `new-${Date.now()}-${index}-${asset.uri}`,
            uri: asset.uri,
            imageId: null,
            isNew: true,
          })),
        ]);
      }
    } catch {
      Alert.alert("오류", "사진을 선택할 수 없습니다.");
    }
  };

  const removeImage = (index: number) => {
    setDraftImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!date) {
      Alert.alert("알림", "방문 날짜를 선택해주세요.");
      return;
    }
    if (!placeId || !currentUser) return;

    if (!isEditMode) {
      const existingCount = await visitService.getImageCountForPlace(placeId);
      if (existingCount + draftImages.length > LIMITS.MAX_IMAGES_PER_PLACE) {
        Alert.alert(
          "알림",
          `이 장소에는 최대 ${LIMITS.MAX_IMAGES_PER_PLACE}장의 사진만 저장할 수 있습니다. (현재 ${existingCount}장)`,
        );
        return;
      }
    } else {
      const existingCount = await visitService.getImageCountForPlace(placeId);
      const initialExistingCount = initialExistingImageIdsRef.current.length;
      const projectedCount =
        existingCount - initialExistingCount + draftImages.length;
      if (projectedCount > LIMITS.MAX_IMAGES_PER_PLACE) {
        Alert.alert(
          "알림",
          `이 장소에는 최대 ${LIMITS.MAX_IMAGES_PER_PLACE}장의 사진만 저장할 수 있습니다. (현재 ${existingCount}장)`,
        );
        return;
      }
    }

    setLoading(true);
    try {
      if (isEditMode && visitId) {
        await updateVisit(visitId, { visitDate: date });

        const keptExistingIds = new Set(
          draftImages
            .filter((img) => !img.isNew && img.imageId)
            .map((img) => img.imageId as string),
        );
        const deletedExistingIds = initialExistingImageIdsRef.current.filter(
          (imageId) => !keptExistingIds.has(imageId),
        );
        for (const imageId of deletedExistingIds) {
          await visitService.deleteImage(imageId);
        }

        const newImageUris = draftImages
          .filter((img) => img.isNew)
          .map((img) => img.uri);
        if (newImageUris.length > 0) {
          await addImages(newImageUris.map((uri) => ({ visitId, uri })));
        }

        if (place?.heroImageId) {
          const refreshedPlaceImages =
            await visitService.getImagesByPlace(placeId);
          const heroStillExists = refreshedPlaceImages.some(
            (img) => img.imageId === place.heroImageId,
          );
          if (!heroStillExists) {
            await updatePlace(placeId, {
              heroImageId: refreshedPlaceImages[0]?.imageId ?? null,
            });
          }
        }
      } else {
        const visit = await addVisit({
          placeId,
          visitDate: date,
          createdByUserId: currentUser.userId,
        });

        if (draftImages.length > 0) {
          await addImages(
            draftImages.map((img) => ({
              visitId: visit.visitId,
              uri: img.uri,
            })),
          );
        }

        if (
          place &&
          (place.status === "wishlist" || place.status === "orphan")
        ) {
          await updatePlace(placeId, { status: "visited" });
        }
      }

      router.back();
    } catch {
      Alert.alert("오류", "저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!visitId || !existingVisit) return;
    setShowDeleteConfirm(false);
    setLoading(true);

    try {
      await deleteVisit(visitId);

      const remainingVisits = visits.filter(
        (v) => v.placeId === existingVisit.placeId && v.visitId !== visitId,
      );
      if (remainingVisits.length === 0 && place && place.status === "visited") {
        await updatePlace(existingVisit.placeId, { status: "orphan" });
      }

      router.back();
    } catch {
      Alert.alert("오류", "삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="close"
          onPress={() => router.back()}
          size={40}
          backgroundColor={colors.bg.elevated}
          color={colors.text.primary}
        />
        <Text style={styles.headerTitle}>
          {isEditMode ? "방문 기록 수정" : "방문 기록 작성"}
        </Text>
        {isEditMode ? (
          <TouchableOpacity onPress={() => setShowDeleteConfirm(true)}>
            <Text style={styles.deleteHeaderBtn}>삭제</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Place Info */}
        {place && (
          <Card style={styles.placeInfo}>
            <View style={styles.placeInfoRow}>
              <Ionicons
                name="location"
                size={18}
                color={colors.accent.primary}
              />
              <View style={styles.placeInfoContent}>
                <Text style={styles.placeName}>{place.name}</Text>
                {place.addressText && (
                  <Text style={styles.placeAddress}>{place.addressText}</Text>
                )}
              </View>
            </View>
          </Card>
        )}

        {/* Date Section — card section */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>방문 날짜</Text>
          <DatePicker value={date} onChange={setDate} />
        </Card>

        {/* Photo Section — card section */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>
            사진 ({draftImages.length}/{LIMITS.MAX_IMAGES_PER_PLACE})
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageRow}
          >
            <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
              <Ionicons
                name="camera-outline"
                size={24}
                color={colors.text.tertiary}
              />
              <Text style={styles.addImageText}>추가</Text>
            </TouchableOpacity>
            {draftImages.map((img, i) => (
              <View key={img.key} style={styles.imageThumbContainer}>
                <Image source={{ uri: img.uri }} style={styles.imageThumb} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => removeImage(i)}
                >
                  <Ionicons
                    name="close"
                    size={12}
                    color={colors.text.inverse}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </Card>
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
          disabled={!placeId}
          style={styles.saveBtn}
        />
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
  safe: { flex: 1, backgroundColor: colors.bg.canvas },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.soft,
  },
  headerTitle: { ...typography.title.l, color: colors.text.primary },
  deleteHeaderBtn: {
    ...typography.title.m,
    color: colors.accent.danger,
  },
  scroll: { flex: 1 },
  content: {
    padding: layout.screenPaddingH,
    paddingTop: spacing[4],
    gap: spacing[4],
  },
  placeInfo: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.xl,
  },
  placeInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  placeInfoContent: { flex: 1 },
  placeName: { ...typography.title.m, color: colors.text.primary },
  placeAddress: {
    ...typography.body.s,
    color: colors.text.secondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.xl,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: "600",
    marginBottom: spacing[3],
  },
  imageRow: { flexDirection: "row" },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border.strong,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
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
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.bg.elevated,
  },
  saveBtn: {
    borderRadius: radius["2xl"],
    height: 56,
  },
});
