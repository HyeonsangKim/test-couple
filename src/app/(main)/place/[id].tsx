import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, Modal, TextInput as RNTextInput, Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, layout, component } from '@/theme/tokens';
import { Button, Chip, IconButton, Card } from '@/components/ui';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useThreadStore } from '@/stores/useThreadStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useDeleteGracePeriod } from '@/hooks/useDeleteGracePeriod';
import { PlaceCategory } from '@/types';
import { CATEGORIES, STATUS_LABELS, CATEGORY_LABELS, LIMITS } from '@/constants';
import { formatDate, formatRelative } from '@/utils/date';
import { validateThreadMessage } from '@/utils/validation';
import { CURRENT_USER_ID } from '@/mock/data';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_GAP = 8;
const IMAGE_PADDING = layout.screenPaddingH * 2;
const IMAGE_TILE_SIZE = (SCREEN_WIDTH - IMAGE_PADDING - IMAGE_GAP * 2) / 3;

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const place = usePlaceStore((s) => s.places.find((p) => p.placeId === id) ?? null);
  const updatePlace = usePlaceStore((s) => s.updatePlace);
  const requestDelete = usePlaceStore((s) => s.requestDelete);
  const cancelDelete = usePlaceStore((s) => s.cancelDelete);
  const approveDelete = usePlaceStore((s) => s.approveDelete);

  const { placeVisits, placeImages, loadVisitsForPlace, loadImagesForPlace } = useVisitStore();
  const { messages, loadMessages, addMessage, deleteMessage } = useThreadStore();
  const currentUser = useAuthStore((s) => s.currentUser);
  const getUserById = useAuthStore((s) => s.getUserById);

  const [newMessage, setNewMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [pendingDeleteMessageId, setPendingDeleteMessageId] = useState<string | null>(null);

  const gracePeriod = useDeleteGracePeriod(place?.deleteRequest ?? null);
  const currentUserId = currentUser?.userId ?? CURRENT_USER_ID;

  useEffect(() => {
    if (id) {
      loadVisitsForPlace(id);
      loadImagesForPlace(id);
      loadMessages(id);
    }
  }, [id]);

  const allImageUris = placeImages.map((img) => img.uri);

  const handleSendMessage = async () => {
    const error = validateThreadMessage(newMessage);
    if (error) {
      Alert.alert('알림', error);
      return;
    }
    if (!currentUser || !id) return;
    try {
      await addMessage({ placeId: id, authorUserId: currentUser.userId, body: newMessage.trim() });
      setNewMessage('');
    } catch {
      Alert.alert('오류', '메시지 전송에 실패했습니다.');
    }
  };

  const handleDeleteMessage = async () => {
    if (!pendingDeleteMessageId) return;

    try {
      await deleteMessage(pendingDeleteMessageId, currentUserId);
      setPendingDeleteMessageId(null);
    } catch {
      Alert.alert('오류', '메시지 삭제에 실패했습니다.');
    }
  };

  const handleRequestDelete = () => {
    if (!currentUser || !id) return;
    requestDelete(id, currentUser.userId);
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
          try {
            await approveDelete(id);
            router.back();
          } catch {
            Alert.alert('오류', '삭제에 실패했습니다.');
          }
        },
      },
    ]);
  };

  const handleCategoryChange = (cat: PlaceCategory) => {
    if (!id) return;
    updatePlace(id, { category: cat, categoryManual: true });
    setShowCategoryPicker(false);
  };

  if (!place) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyContainer}>
          <Ionicons name="help-circle-outline" size={component.emptyState.icon} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>장소를 찾을 수 없어요</Text>
          <Text style={styles.emptyDesc}>삭제되었거나 존재하지 않는 장소입니다.</Text>
          <Button title="뒤로 가기" onPress={() => router.back()} variant="primary" size="md" style={styles.emptyBtn} />
        </View>
      </SafeAreaView>
    );
  }

  const statusColor =
    place.status === 'wishlist'
      ? colors.marker.wishlist
      : place.status === 'visited'
        ? colors.marker.visited
        : colors.marker.orphan;

  // Find hero image URI from placeImages
  const heroImage = place.heroImageId
    ? placeImages.find((img) => img.imageId === place.heroImageId)
    : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon="chevron-back"
          onPress={() => router.back()}
          size={40}
          backgroundColor={colors.bg.elevated}
          color={colors.text.primary}
        />
        <Text numberOfLines={1} style={styles.headerTitle}>장소 상세</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Hero Image */}
          {heroImage ? (
            <Image source={{ uri: heroImage.uri }} style={styles.heroImage} />
          ) : allImageUris.length > 0 ? (
            <Image source={{ uri: allImageUris[0] }} style={styles.heroImage} />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons
                name={place.status === 'wishlist' ? 'heart' : 'location'}
                size={56}
                color={colors.text.tertiary}
              />
            </View>
          )}

          {/* Floating Wishlist Action */}
          {place.status === 'orphan' && (
            <View style={styles.floatingAction}>
              <Button
                title="위시리스트에 추가"
                onPress={() => updatePlace(place.placeId, { status: 'wishlist' })}
                variant="outline"
                size="sm"
              />
            </View>
          )}

          {/* Delete Request Banner — Warning Block pattern */}
          {gracePeriod.isActive && (
            <View style={styles.deleteBanner}>
              <View style={styles.deleteBannerRow}>
                <Ionicons name="trash-outline" size={component.warningBlock.icon} color={colors.accent.danger} />
                <View style={styles.deleteBannerContent}>
                  <Text style={styles.deleteBannerTitle}>삭제 요청됨</Text>
                  <Text style={styles.deleteBannerText}>
                    {gracePeriod.remainingDays > 0
                      ? `${gracePeriod.remainingDays}일 후 삭제`
                      : `${gracePeriod.remainingHours}시간 후 삭제`}
                    {' '}· 모든 방문기록과 사진이 삭제됩니다.
                  </Text>
                  <View style={styles.deleteBannerActions}>
                    {place.deleteRequest?.requestedByUserId === currentUserId ? (
                      <Button
                        title="요청 취소"
                        onPress={() => cancelDelete(place.placeId)}
                        variant="ghost"
                        size="sm"
                      />
                    ) : (
                      <>
                        <Button title="승인" onPress={handleApproveDelete} variant="danger" size="sm" />
                        <Button
                          title="거절"
                          onPress={() => cancelDelete(place.placeId)}
                          variant="ghost"
                          size="sm"
                        />
                      </>
                    )}
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.placeName}>{place.name}</Text>
            {place.addressText && (
              <Text style={styles.placeAddress}>{place.addressText}</Text>
            )}
            <View style={styles.chipRow}>
              <Chip label={STATUS_LABELS[place.status] ?? place.status} selected color={statusColor} size="sm" />
              <TouchableOpacity onPress={() => setShowCategoryPicker(true)}>
                <Chip label={CATEGORY_LABELS[place.category] ?? '미분류'} size="sm" />
              </TouchableOpacity>
              {place.sourceType === 'custom_pin' && <Chip label="커스텀 핀" size="sm" />}
            </View>
          </View>

          {/* Visit Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>방문 기록 ({placeVisits.length})</Text>
              <Button
                title="+ 기록 추가"
                onPress={() =>
                  router.push({
                    pathname: '/(main)/visit/form',
                    params: { placeId: id },
                  })
                }
                variant="ghost"
                size="sm"
              />
            </View>
            {placeVisits.length === 0 ? (
              <View style={styles.emptySection}>
                <Ionicons name="calendar-outline" size={component.emptyState.icon} color={colors.text.tertiary} />
                <Text style={styles.emptySectionText}>아직 방문 기록이 없어요</Text>
              </View>
            ) : (
              placeVisits.map((visit, index) => {
                const author = getUserById(visit.createdByUserId);
                return (
                  <TouchableOpacity
                    key={visit.visitId}
                    style={styles.visitCard}
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push({
                        pathname: '/(main)/visit/form',
                        params: { visitId: visit.visitId, placeId: id },
                      })
                    }
                  >
                    <View style={styles.visitHeader}>
                      <View style={styles.visitDateRow}>
                        <Text style={styles.visitDate}>{formatDate(visit.visitDate)}</Text>
                        {placeVisits.length > 1 && (
                          <View style={styles.visitBadge}>
                            <Text style={styles.visitBadgeText}>{placeVisits.length - index}번째</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.visitAuthor}>{author?.nickname ?? '알 수 없음'}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Image Gallery */}
          {allImageUris.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>사진 모아보기 ({allImageUris.length})</Text>
              <View style={styles.imageGrid}>
                {allImageUris.map((uri, index) => (
                  <Image key={`img_${index}`} source={{ uri }} style={styles.gridImage} />
                ))}
              </View>
            </View>
          )}

          {/* Thread */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>공유 메모</Text>
            {messages.length === 0 ? (
              <View style={styles.emptySection}>
                <Ionicons name="chatbubble-outline" size={component.emptyState.icon} color={colors.text.tertiary} />
                <Text style={styles.emptySectionText}>첫 번째 메모를 남겨보세요</Text>
              </View>
            ) : (
              messages.map((msg) => {
                const author = getUserById(msg.authorUserId);
                const isMine = msg.authorUserId === currentUserId;
                return (
                  <View key={msg.messageId} style={[styles.msgRow, isMine && styles.msgRowMine]}>
                    <TouchableOpacity
                      activeOpacity={isMine ? 0.86 : 1}
                      delayLongPress={300}
                      disabled={!isMine}
                      onLongPress={() => setPendingDeleteMessageId(msg.messageId)}
                      style={[styles.msgBubble, isMine ? styles.msgBubbleMine : styles.msgBubblePartner]}
                    >
                      {!isMine && (
                        <Text style={styles.msgAuthor}>{author?.nickname ?? '?'}</Text>
                      )}
                      <Text style={styles.msgBody}>{msg.body}</Text>
                      <View style={styles.msgMeta}>
                        <Text style={styles.msgTime}>{formatRelative(msg.createdAt)}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>

          {/* Delete Place */}
          {!gracePeriod.isActive && (
            <View style={styles.section}>
              <Button
                title="장소 삭제 요청"
                onPress={() => setShowDeleteConfirm(true)}
                variant="ghost"
                size="sm"
                textStyle={{ color: colors.accent.danger }}
              />
            </View>
          )}
        </ScrollView>

        {/* Message Composer Bar */}
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, spacing[4]) }]}>
          <View style={styles.inputWrapper}>
            <RNTextInput
              style={styles.messageInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="메모를 남겨보세요..."
              placeholderTextColor={colors.text.tertiary}
              maxLength={LIMITS.MAX_THREAD_MESSAGE_LENGTH}
              multiline
              showSoftInputOnFocus
              textAlignVertical="center"
            />
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, newMessage.trim() ? styles.sendBtnActive : null]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons
              name="send"
              size={18}
              color={newMessage.trim() ? colors.text.inverse : colors.text.tertiary}
            />
          </TouchableOpacity>
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

      <ConfirmModal
        visible={pendingDeleteMessageId !== null}
        title="메시지 삭제"
        message="이 메모를 삭제하시겠습니까?"
        confirmLabel="삭제"
        onConfirm={handleDeleteMessage}
        onCancel={() => setPendingDeleteMessageId(null)}
        danger
      />

      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryPicker(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.categoryPicker}>
            <Text style={styles.categoryPickerTitle}>카테고리 변경</Text>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryOption,
                  place.category === cat.key && styles.categoryOptionActive,
                ]}
                onPress={() => handleCategoryChange(cat.key)}
              >
                <Ionicons
                  name={cat.icon}
                  size={20}
                  color={place.category === cat.key ? colors.accent.primary : cat.color}
                />
                <Text
                  style={[
                    styles.categoryLabel,
                    place.category === cat.key && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.soft,
    backgroundColor: colors.bg.elevated,
  },
  headerTitle: {
    ...typography.title.l,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing[3],
  },
  headerSpacer: {
    width: 40,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[10],
  },
  emptyTitle: { ...typography.heading.m, color: colors.text.primary, marginTop: spacing[4], marginBottom: spacing[2] },
  emptyDesc: { ...typography.body.m, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing[6] },
  emptyBtn: { borderRadius: radius.full },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing[6] },

  /* Hero */
  heroImage: {
    width: '100%',
    height: component.hero.height,
    backgroundColor: colors.bg.soft,
  },
  heroPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingAction: {
    position: 'absolute',
    top: component.hero.overlayOffset,
    right: layout.screenPaddingH,
    zIndex: 10,
  },

  /* Delete Request Banner — Warning Block */
  deleteBanner: {
    marginHorizontal: layout.screenPaddingH,
    marginTop: spacing[3],
    backgroundColor: colors.status.deleteBg,
    borderRadius: component.warningBlock.radius,
    padding: component.warningBlock.padding,
  },
  deleteBannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  deleteBannerContent: { flex: 1 },
  deleteBannerTitle: {
    ...typography.title.m,
    color: colors.accent.danger,
    marginBottom: spacing[1],
  },
  deleteBannerText: {
    ...typography.body.s,
    color: colors.accent.danger,
    marginBottom: spacing[2],
  },
  deleteBannerActions: { flexDirection: 'row', gap: spacing[2] },

  /* Summary Card */
  summaryCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.xl,
    padding: 20,
    marginHorizontal: layout.screenPaddingH,
    marginTop: spacing[4],
    marginBottom: layout.sectionGap,
  },
  placeName: { ...typography.heading.l, color: colors.text.primary, marginBottom: spacing[1] },
  placeAddress: { ...typography.body.m, color: colors.text.secondary, marginBottom: spacing[3] },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },

  /* Sections */
  section: { paddingHorizontal: layout.screenPaddingH, marginBottom: layout.sectionGap },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: { ...typography.title.l, color: colors.text.primary },

  /* Empty section state */
  emptySection: {
    alignItems: 'center',
    paddingVertical: component.emptyState.verticalPadding,
  },
  emptySectionText: {
    ...typography.body.m,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[3],
  },

  /* Visit cards */
  visitCard: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[2],
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  visitDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  visitDate: { ...typography.title.m, color: colors.text.primary },
  visitBadge: {
    backgroundColor: colors.accent.primarySoft,
    borderRadius: radius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
  },
  visitBadgeText: { ...typography.caption, color: colors.accent.primary, fontWeight: '700' },
  visitAuthor: { ...typography.body.s, color: colors.text.secondary },

  /* Image grid — 3 columns */
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: IMAGE_GAP,
    marginTop: spacing[3],
  },
  gridImage: {
    width: IMAGE_TILE_SIZE,
    height: IMAGE_TILE_SIZE,
    borderRadius: radius.md,
    backgroundColor: colors.bg.soft,
  },

  /* Thread messages */
  msgRow: {
    flexDirection: 'row',
    marginBottom: spacing[3],
  },
  msgRowMine: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '75%',
    borderRadius: radius.md,
    padding: spacing[3],
  },
  msgBubbleMine: {
    backgroundColor: colors.accent.primarySoft,
    borderBottomRightRadius: 4,
  },
  msgBubblePartner: {
    backgroundColor: colors.bg.elevated,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border.soft,
  },
  msgAuthor: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  msgBody: { ...typography.body.m, color: colors.text.primary },
  msgMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  msgTime: { ...typography.caption, color: colors.text.tertiary, fontSize: 11 },

  /* Message Composer Bar */
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    backgroundColor: colors.bg.elevated,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    gap: spacing[2],
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: colors.bg.soft,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[3],
    minHeight: 60,
    justifyContent: 'center',
  },
  messageInput: {
    ...typography.body.m,
    color: colors.text.primary,
    minHeight: 24,
    maxHeight: 80,
    paddingVertical: spacing[3],
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: colors.accent.primary,
  },

  /* Category Picker Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[6],
  },
  categoryPicker: {
    backgroundColor: colors.bg.elevated,
    borderRadius: component.modal.radius,
    padding: component.modal.padding,
    width: '100%',
    maxWidth: component.modal.maxWidth,
  },
  categoryPickerTitle: {
    ...typography.heading.m,
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderRadius: radius.md,
    gap: spacing[3],
  },
  categoryOptionActive: { backgroundColor: colors.bg.soft },
  categoryLabel: { ...typography.body.l, color: colors.text.primary },
  categoryLabelActive: { fontWeight: '700', color: colors.accent.primary },
});
