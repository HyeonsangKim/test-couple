import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, layout } from '@/theme/tokens';
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
          backgroundColor={colors.surface.primary}
          color={colors.text.primary}
        />
        <Text style={styles.headerTitle}>연결 해제</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.warningIconCircle}>
          <Ionicons name="warning-outline" size={40} color={colors.accent.warning} />
        </View>
        <Text style={styles.title}>정말 연결을 해제하시겠어요?</Text>
        <Text style={styles.description}>
          연결을 해제하면 더 이상 같은 지도를 공유하지 않습니다.{'\n\n'}
          현재 지도는 읽기 전용 스냅샷으로 저장되며, 수정할 수 없습니다.{'\n\n'}
          같은 사람과 다시 연결하면 스냅샷에서 복구할 수 있습니다.
        </Text>

        {/* Impact Summary */}
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
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  title: {
    ...typography.heading.m,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  description: {
    ...typography.body.m,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[6],
  },
  statsCard: {
    width: '100%',
    marginBottom: spacing[8],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1, paddingVertical: spacing[2] },
  statValue: { ...typography.heading.l, color: colors.accent.primary },
  statLabel: { ...typography.caption, color: colors.text.secondary, marginTop: spacing[1] },
  statDivider: { width: 1, height: 40, backgroundColor: colors.border.soft },
  disconnectBtn: {
    borderRadius: radius.pill,
    width: '100%',
  },
});
