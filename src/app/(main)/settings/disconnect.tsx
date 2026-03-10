import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, layout, component } from '@/theme/tokens';
import { Button, IconButton, Card } from '@/components/ui';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useMapStore } from '@/stores/useMapStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useSnapshotStore } from '@/stores/useSnapshotStore';

export default function DisconnectScreen() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const map = useMapStore((s) => s.map);
  const disconnect = useMapStore((s) => s.disconnect);
  const currentUser = useAuthStore((s) => s.currentUser);
  const partner = useAuthStore((s) => s.partner);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const places = usePlaceStore((s) => s.places);
  const { visits } = useVisitStore();
  const createSnapshot = useSnapshotStore((s) => s.createSnapshot);

  const handleDisconnect = async () => {
    if (!map || !currentUser || !partner) return;
    setLoading(true);
    setShowConfirm(false);

    try {
      // Create snapshot before disconnecting
      const snapshot = await createSnapshot(
        map.mapId,
        partner.userId,
        map.mapId,
      );
      await disconnect(currentUser.userId);
      router.replace(`/snapshot/${snapshot.snapshotId}`);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.headerTitle}>연결 해제</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Warning Block */}
        <View style={styles.warningBlock}>
          <View style={styles.warningHeader}>
            <Ionicons name="warning-outline" size={component.warningBlock.icon} color={colors.accent.danger} />
            <Text style={styles.warningTitle}>연결을 해제하면 되돌릴 수 없습니다</Text>
          </View>
          <Text style={styles.warningCopy}>
            더 이상 같은 지도를 공유하지 않으며, 현재 지도는 읽기 전용 스냅샷으로 저장됩니다.
          </Text>
        </View>

        {/* Impact Summary */}
        <Text style={styles.sectionTitle}>영향받는 데이터</Text>
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{places.length}</Text>
              <Text style={styles.statLabel}>장소</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{visits.length}</Text>
              <Text style={styles.statLabel}>방문기록</Text>
            </View>
          </View>
        </Card>

        {/* Consequence Details */}
        <Text style={styles.sectionTitle}>해제 후 변경사항</Text>
        <View style={styles.consequenceList}>
          <View style={styles.consequenceItem}>
            <Ionicons name="document-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.consequenceText}>현재 지도는 읽기 전용 스냅샷으로 보관됩니다</Text>
          </View>
          <View style={styles.consequenceItem}>
            <Ionicons name="refresh-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.consequenceText}>같은 파트너와 다시 연결하면 스냅샷에서 복구할 수 있습니다</Text>
          </View>
          <View style={styles.consequenceItem}>
            <Ionicons name="close-circle-outline" size={18} color={colors.text.secondary} />
            <Text style={styles.consequenceText}>스냅샷에 포함되지 않은 데이터는 영구 삭제됩니다</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer CTA */}
      <View style={styles.footer}>
        <Button
          title="연결 해제"
          onPress={() => setShowConfirm(true)}
          variant="danger"
          size="lg"
          fullWidth
          loading={loading}
          style={styles.disconnectBtn}
        />
      </View>

      <ConfirmModal
        visible={showConfirm}
        title="연결 해제"
        message={`${partner?.nickname ?? '파트너'}와의 연결을 해제합니다. 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="연결 해제"
        onConfirm={handleDisconnect}
        onCancel={() => setShowConfirm(false)}
        danger
      />
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
  },
  headerTitle: { ...typography.title.l, color: colors.text.primary },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  warningBlock: {
    backgroundColor: colors.status.deleteBg,
    borderRadius: component.warningBlock.radius,
    padding: component.warningBlock.padding,
    marginBottom: spacing[6],
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  warningTitle: {
    ...typography.title.m,
    color: colors.accent.danger,
    flex: 1,
  },
  warningCopy: {
    ...typography.body.m,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.title.m,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  statsCard: {
    marginBottom: spacing[6],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1, paddingVertical: spacing[2] },
  statValue: { ...typography.heading.l, color: colors.accent.primary },
  statLabel: { ...typography.caption, color: colors.text.secondary, marginTop: spacing[1] },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border.soft },
  consequenceList: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  consequenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  consequenceText: {
    ...typography.body.m,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.bg.elevated,
  },
  disconnectBtn: {
    borderRadius: radius['2xl'],
  },
});
