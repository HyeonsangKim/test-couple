import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, layout } from '@/theme/tokens';
import { Button, IconButton, Card } from '@/components/ui';
import { useSnapshotStore } from '@/stores/useSnapshotStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatDate } from '@/utils/date';

export default function RestoreDecisionScreen() {
  const router = useRouter();
  const { snapshots, loadSnapshots } = useSnapshotStore();
  const partner = useAuthStore((s) => s.partner);

  useEffect(() => {
    loadSnapshots();
  }, []);

  // Find a relevant snapshot for the current partner
  const relevantSnapshot = partner
    ? snapshots.find((s) => s.partnerUserId === partner.userId)
    : snapshots.length > 0
      ? snapshots[0]
      : null;

  const handleRestore = () => {
    Alert.alert(
      '데이터 복구',
      '스냅샷의 데이터를 현재 지도로 복구합니다. 기존 데이터는 유지됩니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '복구',
          onPress: () => {
            // In a real app, this would restore snapshot data to the current map
            Alert.alert('완료', '데이터가 복구되었습니다.', [
              { text: '확인', onPress: () => router.replace('/(tabs)/map') },
            ]);
          },
        },
      ],
    );
  };

  const handleNewStart = () => {
    Alert.alert(
      '새로 시작',
      '이전 데이터 없이 새로운 지도를 시작합니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '시작',
          onPress: () => router.replace('/(tabs)/map'),
        },
      ],
    );
  };

  if (!relevantSnapshot) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <IconButton
            icon="chevron-back"
            onPress={() => router.back()}
            size={40}
            backgroundColor={colors.bg.elevated}
            color={colors.text.primary}
          />
          <Text style={styles.headerTitle}>데이터 복구</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="document-outline" size={48} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>복구할 데이터가 없어요</Text>
          <Text style={styles.emptyDesc}>이전 연결 기록의 스냅샷이 없습니다.</Text>
          <Button
            title="새로 시작하기"
            onPress={() => router.replace('/(tabs)/map')}
            variant="primary"
            size="lg"
            style={styles.emptyBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>데이터 복구</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Structured Header */}
        <View style={styles.pageHeader}>
          <View style={styles.headerIcon}>
            <Ionicons name="refresh-outline" size={28} color={colors.accent.primary} />
          </View>
          <Text style={styles.title}>이전 데이터를 복구할까요?</Text>
          <Text style={styles.description}>
            이전 연결에서 저장된 스냅샷을 발견했습니다. 복구하거나 새로 시작할 수 있습니다.
          </Text>
        </View>

        {/* Snapshot Summary Card */}
        <Card style={styles.previewCard}>
          <View style={styles.previewRow}>
            <Ionicons name="camera-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.previewDate}>
              {formatDate(relevantSnapshot.createdAt)}의 스냅샷
            </Text>
          </View>
          <View style={styles.previewStats}>
            <View style={styles.previewStat}>
              <Text style={styles.previewStatValue}>{relevantSnapshot.places.length}</Text>
              <Text style={styles.previewStatLabel}>장소</Text>
            </View>
            <View style={styles.previewStat}>
              <Text style={styles.previewStatValue}>{relevantSnapshot.visits.length}</Text>
              <Text style={styles.previewStatLabel}>방문기록</Text>
            </View>
            <View style={styles.previewStat}>
              <Text style={styles.previewStatValue}>{relevantSnapshot.visitImages.length}</Text>
              <Text style={styles.previewStatLabel}>사진</Text>
            </View>
          </View>
        </Card>

        {/* Consequence Explanation */}
        <Text style={styles.sectionTitle}>각 선택의 결과</Text>
        <View style={styles.consequenceBlock}>
          <View style={styles.consequenceItem}>
            <Ionicons name="checkmark-circle" size={18} color={colors.accent.mint} />
            <Text style={styles.consequenceText}>
              <Text style={styles.consequenceBold}>복구: </Text>
              스냅샷의 장소, 방문기록, 사진을 현재 지도에 추가합니다. 기존 데이터는 유지됩니다.
            </Text>
          </View>
          <View style={styles.consequenceItem}>
            <Ionicons name="add-circle" size={18} color={colors.accent.info} />
            <Text style={styles.consequenceText}>
              <Text style={styles.consequenceBold}>새로 시작: </Text>
              이전 데이터 없이 빈 지도로 시작합니다. 스냅샷은 보관되며 나중에 복구할 수 있습니다.
            </Text>
          </View>
        </View>

        {/* Warning */}
        <Text style={styles.warningText}>
          복구는 되돌릴 수 없으며, 중복 장소는 자동으로 병합됩니다.
        </Text>
      </ScrollView>

      {/* Fixed Footer Actions */}
      <View style={styles.footer}>
        <Button
          title="스냅샷에서 복구"
          onPress={handleRestore}
          variant="primary"
          size="lg"
          fullWidth
          style={styles.actionBtn}
        />
        <Button
          title="새로 시작하기"
          onPress={handleNewStart}
          variant="secondary"
          size="lg"
          fullWidth
          style={styles.actionBtnSecondary}
        />
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },
  pageHeader: {
    marginBottom: spacing[6],
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    ...shadow.sm,
  },
  title: {
    ...typography.heading.m,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  description: {
    ...typography.body.m,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  previewCard: {
    marginBottom: spacing[6],
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  previewDate: {
    ...typography.title.m,
    color: colors.text.primary,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewStat: {
    alignItems: 'center',
  },
  previewStatValue: {
    ...typography.heading.m,
    color: colors.accent.primary,
  },
  previewStatLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.title.m,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  consequenceBlock: {
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
  consequenceBold: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  warningText: {
    ...typography.body.s,
    color: colors.text.tertiary,
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.bg.elevated,
    gap: spacing[3],
  },
  actionBtn: {
    borderRadius: radius['2xl'],
  },
  actionBtnSecondary: {
    borderRadius: radius['2xl'],
    backgroundColor: colors.bg.soft,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
  },
  emptyTitle: {
    ...typography.heading.m,
    color: colors.text.primary,
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  emptyDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  emptyBtn: {
    borderRadius: radius['2xl'],
  },
});
