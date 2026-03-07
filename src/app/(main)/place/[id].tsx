import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/theme/tokens';
import { Button, Chip, IconButton } from '@/components/ui';
import { TextInput } from '@/components/ui';
import { VisitRecordCard } from '@/components/place/VisitRecordCard';
import { ThreadMessageComponent } from '@/components/place/ThreadMessage';
import { ImageGallery } from '@/components/place/ImageGallery';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { EmptyState } from '@/components/common/EmptyState';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useThreadStore } from '@/stores/useThreadStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useDeleteGracePeriod } from '@/hooks/useDeleteGracePeriod';
import { Category, PlaceStatus } from '@/types';
import { CATEGORIES, STATUS_LABELS, CATEGORY_LABELS, LIMITS } from '@/constants';
import { formatDate, getRemainingDays } from '@/utils/date';
import { validateThreadMessage } from '@/utils/validation';
import { CURRENT_USER_ID } from '@/mock/data';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const place = usePlaceStore((s) => s.places.find((p) => p.id === id) ?? null);
  const updatePlace = usePlaceStore((s) => s.updatePlace);
  const requestDelete = usePlaceStore((s) => s.requestDelete);
  const cancelDelete = usePlaceStore((s) => s.cancelDelete);
  const approveDelete = usePlaceStore((s) => s.approveDelete);

  const { placeVisits, loadVisitsForPlace } = useVisitStore();
  const { messages, loadThread, addMessage, deleteMessage } = useThreadStore();
  const currentUser = useAuthStore((s) => s.currentUser);

  const [newMessage, setNewMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const gracePeriod = useDeleteGracePeriod(place?.deleteRequest ?? null);

  useEffect(() => {
    if (id) {
      loadVisitsForPlace(id);
      loadThread(id);
    }
  }, [id]);

  const allImageUris = placeVisits.flatMap((v) => v.imageUris);

  const handleSendMessage = async () => {
    const error = validateThreadMessage(newMessage);
    if (error) {
      Alert.alert('알림', error);
      return;
    }
    if (!currentUser || !id) return;
    await addMessage({ placeId: id, authorId: currentUser.id, content: newMessage.trim() });
    setNewMessage('');
  };

  const handleDeleteMessage = (msgId: string) => {
    Alert.alert('메시지 삭제', '이 메시지를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: () => deleteMessage(msgId) },
    ]);
  };

  const handleRequestDelete = () => {
    if (!currentUser || !id) return;
    requestDelete(id, currentUser.id);
    setShowDeleteConfirm(false);
  };

  const handleApproveDelete = () => {
    if (!id) return;
    Alert.alert('삭제 승인', '이 장소를 즉시 삭제하시겠습니까?\n모든 방문기록과 사진이 삭제됩니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await approveDelete(id);
          router.back();
        },
      },
    ]);
  };

  const handleToggleWishlist = () => {
    if (!id || !place) return;
    if (place.status === 'wishlist') {
      // Can't remove from wishlist without adding a visit
    } else if (place.status === 'orphan') {
      updatePlace(id, { status: 'wishlist' });
    }
  };

  const handleCategoryChange = (cat: Category) => {
    if (!id) return;
    updatePlace(id, { category: cat, categoryManual: true });
    setShowCategoryPicker(false);
  };

  if (!place) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState icon="help-circle-outline" title="장소를 찾을 수 없어요" description="삭제되었거나 존재하지 않는 장소입니다." />
      </SafeAreaView>
    );
  }

  const statusColor = place.status === 'wishlist' ? colors.markerWishlist : place.status === 'visited' ? colors.markerVisited : colors.markerOrphan;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <IconButton icon="chevron-back" onPress={() => router.back()} backgroundColor={colors.surface} />
            <View style={styles.headerActions}>
              {place.status === 'orphan' && (
                <Button title="위시리스트에 추가" onPress={handleToggleWishlist} variant="outline" size="sm" />
              )}
            </View>
          </View>

          {/* Hero Image */}
          {place.heroImageUri ? (
            <Image source={{ uri: place.heroImageUri }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons
                name={place.status === 'wishlist' ? 'heart' : 'location'}
                size={56}
                color={colors.primary}
              />
            </View>
          )}

          {/* Delete Request Banner */}
          {gracePeriod.isActive && (
            <View style={styles.deleteBanner}>
              <Ionicons name="trash-outline" size={24} color={colors.deleteRed} />
              <View style={styles.deleteBannerContent}>
                <Text style={styles.deleteBannerText}>
                  삭제 요청됨 · {gracePeriod.remainingDays > 0 ? `${gracePeriod.remainingDays}일 후 삭제` : `${gracePeriod.remainingHours}시간 후 삭제`}
                </Text>
                <View style={styles.deleteBannerActions}>
                  {place.deleteRequest?.requestedBy === CURRENT_USER_ID ? (
                    <Button title="요청 취소" onPress={() => cancelDelete(place.id)} variant="ghost" size="sm" />
                  ) : (
                    <>
                      <Button title="승인" onPress={handleApproveDelete} variant="danger" size="sm" />
                      <Button title="거절" onPress={() => cancelDelete(place.id)} variant="ghost" size="sm" />
                    </>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Place Info */}
          <View style={styles.infoSection}>
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeAddress}>{place.address}</Text>
            <View style={styles.chipRow}>
              <Chip label={STATUS_LABELS[place.status] ?? place.status} selected color={statusColor} size="sm" />
              <TouchableOpacity onPress={() => setShowCategoryPicker(true)}>
                <Chip
                  label={CATEGORY_LABELS[place.category] ?? '미분류'}
                  size="sm"
                />
              </TouchableOpacity>
              {place.type === 'custom' && <Chip label="커스텀 핀" size="sm" />}
            </View>
          </View>

          {/* Visit Records */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>방문 기록 ({placeVisits.length})</Text>
              <Button
                title="+ 기록 추가"
                onPress={() => router.push({ pathname: '/(main)/visit/create', params: { placeId: id } })}
                variant="ghost"
                size="sm"
              />
            </View>
            {placeVisits.length === 0 ? (
              <Text style={styles.emptyText}>아직 방문 기록이 없어요</Text>
            ) : (
              placeVisits.map((visit, index) => (
                <VisitRecordCard
                  key={visit.id}
                  visit={visit}
                  visitNumber={placeVisits.length - index}
                  onPress={() => router.push(`/(main)/visit/${visit.id}`)}
                />
              ))
            )}
          </View>

          {/* Image Gallery */}
          {allImageUris.length > 0 && (
            <View style={styles.section}>
              <ImageGallery imageUris={allImageUris} />
            </View>
          )}

          {/* Thread */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>공유 스레드</Text>
            {messages.length === 0 ? (
              <Text style={styles.emptyText}>첫 번째 메모를 남겨보세요</Text>
            ) : (
              messages.map((msg) => (
                <ThreadMessageComponent
                  key={msg.id}
                  message={msg}
                  onEdit={msg.authorId === CURRENT_USER_ID ? () => {} : undefined}
                  onDelete={msg.authorId === CURRENT_USER_ID ? () => handleDeleteMessage(msg.id) : undefined}
                />
              ))
            )}
          </View>

          {/* Delete Place Button */}
          {!gracePeriod.isActive && (
            <View style={styles.section}>
              <Button
                title="장소 삭제 요청"
                onPress={() => setShowDeleteConfirm(true)}
                variant="ghost"
                size="sm"
                textStyle={{ color: colors.deleteRed }}
              />
            </View>
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="메모를 남겨보세요..."
              maxLength={LIMITS.MAX_THREAD_MESSAGE_LENGTH}
              multiline
              containerStyle={{ flex: 1 }}
              style={styles.messageInput}
            />
          </View>
          <IconButton
            icon="send"
            onPress={handleSendMessage}
            size={40}
            backgroundColor={newMessage.trim() ? colors.primary : colors.border}
            color={newMessage.trim() ? colors.white : colors.textTertiary}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        visible={showDeleteConfirm}
        title="장소 삭제 요청"
        message="이 장소의 삭제를 요청하시겠습니까? 상대방이 승인하면 즉시 삭제되며, 승인 없이 3일 후 자동 삭제됩니다."
        confirmLabel="삭제 요청"
        onConfirm={handleRequestDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        danger
      />

      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryPicker(false)}>
          <View style={styles.categoryPicker}>
            <Text style={styles.categoryPickerTitle}>카테고리 변경</Text>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[styles.categoryOption, place.category === cat.key && styles.categoryOptionActive]}
                onPress={() => handleCategoryChange(cat.key)}
              >
                <Ionicons name={cat.icon} size={20} color={place.category === cat.key ? colors.primary : cat.color} />
                <Text style={[styles.categoryLabel, place.category === cat.key && styles.categoryLabelActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  heroImage: {
    width: '100%',
    height: 240,
    backgroundColor: colors.border,
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  deleteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.deleteBg,
    padding: spacing.md,
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  deleteBannerContent: { flex: 1 },
  deleteBannerText: { ...typography.captionBold, color: colors.deleteRed, marginBottom: spacing.xs },
  deleteBannerActions: { flexDirection: 'row', gap: spacing.sm },
  infoSection: { padding: spacing.xl },
  placeName: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
  placeAddress: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  section: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.subtitle, color: colors.text },
  emptyText: { ...typography.body, color: colors.textTertiary, textAlign: 'center', paddingVertical: spacing.xl },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  inputWrapper: { flex: 1 },
  messageInput: { maxHeight: 80, paddingVertical: spacing.sm },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  categoryPicker: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    width: '100%',
    maxWidth: 320,
  },
  categoryPickerTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.lg },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  categoryOptionActive: { backgroundColor: colors.primaryLight },
  categoryLabel: { ...typography.body, color: colors.text },
  categoryLabelActive: { fontWeight: '700', color: colors.primary },
});
