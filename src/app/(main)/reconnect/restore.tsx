import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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
            backgroundColor={colors.surface.primary}
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
          backgroundColor={colors.surface.primary}
          color={colors.text.primary}
        />
        <Text style={styles.headerTitle}>데이터 복구</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="refresh-outline" size={40} color={colors.accent.primary} />
        </View>

        <Text style={styles.title}>이전 데이터를 복구할까요?</Text>
        <Text style={styles.description}>
          이전 연결에서 저장된 데이터를 현재 지도에 복구할 수 있습니다.
        </Text>

        {/* Snapshot Preview */}
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

        {/* Actions */}
        <View style={styles.actions}>
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
            style={styles.actionBtn}
          />
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    ...shadow.sm,
  },
  title: {
    ...typography.heading.m,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  description: {
    ...typography.body.m,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
    lineHeight: 22,
  },
  previewCard: {
    width: '100%',
    marginBottom: spacing[8],
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
  actions: {
    width: '100%',
    gap: spacing[3],
  },
  actionBtn: {
    borderRadius: radius.pill,
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
    borderRadius: radius.pill,
  },
});
