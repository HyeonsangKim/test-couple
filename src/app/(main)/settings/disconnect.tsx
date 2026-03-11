import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, radius, spacing, typography, component } from '@/theme/tokens';
import { Button } from '@/components/ui';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import {
  BottomCtaBar,
  SettingsHeader,
  SettingsSection,
  SettingsSurface,
} from '@/components/settings';
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
  const places = usePlaceStore((s) => s.places);
  const { visits } = useVisitStore();
  const createSnapshot = useSnapshotStore((s) => s.createSnapshot);

  const handleDisconnect = async () => {
    if (!map || !currentUser || !partner) return;

    setLoading(true);
    setShowConfirm(false);

    try {
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
      <SettingsHeader title="연결 해제" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        <SettingsSurface tone="danger">
          <View style={styles.warningHeader}>
            <Ionicons
              name="warning-outline"
              size={component.warningBlock.icon}
              color={colors.accent.danger}
            />
            <Text style={styles.warningTitle}>연결을 해제하면 되돌릴 수 없습니다</Text>
          </View>
          <Text style={styles.warningCopy}>
            더 이상 같은 지도를 공유하지 않으며, 현재 지도는 읽기 전용 스냅샷으로 저장됩니다.
          </Text>
        </SettingsSurface>

        <SettingsSection style={styles.section} title="영향받는 데이터">
          <View style={styles.statsGrid}>
            <SettingsSurface style={styles.statCard}>
              <Text style={styles.statValue}>{places.length}</Text>
              <Text style={styles.statLabel}>장소</Text>
            </SettingsSurface>
            <SettingsSurface style={styles.statCard}>
              <Text style={styles.statValue}>{visits.length}</Text>
              <Text style={styles.statLabel}>방문기록</Text>
            </SettingsSurface>
          </View>
        </SettingsSection>

        <SettingsSection style={styles.section} title="해제 후 변경사항">
          <View style={styles.effectStack}>
            <SettingsSurface style={styles.effectRow}>
              <Ionicons name="document-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.effectText}>현재 지도는 읽기 전용 스냅샷으로 보관됩니다.</Text>
            </SettingsSurface>
            <SettingsSurface style={styles.effectRow}>
              <Ionicons name="refresh-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.effectText}>같은 파트너와 다시 연결하면 스냅샷에서 복구할 수 있습니다.</Text>
            </SettingsSurface>
            <SettingsSurface style={styles.effectRow}>
              <Ionicons name="close-circle-outline" size={18} color={colors.text.secondary} />
              <Text style={styles.effectText}>스냅샷에 포함되지 않은 데이터는 영구 삭제됩니다.</Text>
            </SettingsSurface>
          </View>
        </SettingsSection>
      </ScrollView>

      <BottomCtaBar>
        <Button
          title="연결 해제"
          onPress={() => setShowConfirm(true)}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          style={styles.ctaButton}
          textStyle={styles.ctaButtonText}
        />
      </BottomCtaBar>

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
  safe: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
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
  section: {
    marginTop: spacing[7],
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statCard: {
    flex: 1,
    minHeight: 96,
    justifyContent: 'space-between',
  },
  statValue: {
    ...typography.heading.m,
    color: colors.accent.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  effectStack: {
    gap: spacing[3],
  },
  effectRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  effectText: {
    ...typography.body.m,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 22,
  },
  ctaButton: {
    borderRadius: radius.lg,
    backgroundColor: colors.accent.danger,
  },
  ctaButtonText: {
    color: colors.text.inverse,
  },
});
