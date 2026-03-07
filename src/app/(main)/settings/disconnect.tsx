import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { Button, IconButton } from '@/components/ui';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useMapStore } from '@/stores/useMapStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { useThreadStore } from '@/stores/useThreadStore';
import { useSnapshotStore } from '@/stores/useSnapshotStore';

export default function DisconnectScreen() {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const map = useMapStore((s) => s.map);
  const disconnect = useMapStore((s) => s.disconnect);
  const currentUser = useAuthStore((s) => s.currentUser);
  const partner = useAuthStore((s) => s.partner);
  const places = usePlaceStore((s) => s.places);
  const visits = useVisitStore((s) => s.visits);
  const createSnapshot = useSnapshotStore((s) => s.createSnapshot);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleDisconnect = async () => {
    if (!map || !currentUser) return;
    setLoading(true);
    setShowConfirm(false);

    try {
      // Create snapshot before disconnecting
      await createSnapshot(
        map.id,
        currentUser.id,
        partner?.nickname ?? '알 수 없음',
        places,
        visits,
        [],
      );
      await disconnect();
      setOnboarded(false);
      router.replace('/(auth)/welcome');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>연결 해제</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.warningIconCircle}>
          <Ionicons name="warning-outline" size={40} color={colors.warning} />
        </View>
        <Text style={styles.title}>정말 연결을 해제하시겠어요?</Text>
        <Text style={styles.description}>
          연결을 해제하면 더 이상 같은 지도를 공유하지 않습니다.{'\n\n'}
          현재 지도는 읽기 전용 스냅샷으로 저장되며, 수정할 수 없습니다.{'\n\n'}
          같은 사람과 다시 연결하면 스냅샷에서 복구할 수 있습니다.
        </Text>

        <View style={styles.statsBox}>
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
  content: {
    flex: 1,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  title: { ...typography.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.lg },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  statsBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { ...typography.h2, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  statDivider: { width: 1, backgroundColor: colors.border },
  disconnectBtn: { marginTop: spacing.lg },
});
