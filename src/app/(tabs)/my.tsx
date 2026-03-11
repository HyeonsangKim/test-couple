import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, layout, component } from '@/theme/tokens';
import { Avatar, Button } from '@/components/ui';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMapStore } from '@/stores/useMapStore';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useSnapshotStore } from '@/stores/useSnapshotStore';
import { formatDate } from '@/utils/date';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItemData {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  subtitle?: string;
  danger?: boolean;
}

interface StatCardData {
  value: string;
  label: string;
}

export default function MyScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const partner = useAuthStore((s) => s.partner);
  const logout = useAuthStore((s) => s.logout);
  const withdraw = useAuthStore((s) => s.withdraw);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const map = useMapStore((s) => s.map);
  const places = usePlaceStore((s) => s.places);
  const { snapshots } = useSnapshotStore();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showWithdrawStep1, setShowWithdrawStep1] = useState(false);
  const [showWithdrawStep2, setShowWithdrawStep2] = useState(false);

  const isConnected = Boolean(map && map.memberUserIds.length >= 2);
  const visitedCount = places.filter((p) => p.status === 'visited').length;
  const wishlistCount = places.filter((p) => p.status === 'wishlist').length;

  let dDayText = '';
  if (map?.anniversaryDate) {
    const today = new Date();
    const anniv = new Date(map.anniversaryDate);
    const diffMs = today.getTime() - anniv.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    dDayText = `D+${diffDays}`;
  }

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await logout();
      setOnboarded(false);
      router.replace('/(auth)/login');
    } catch {
      // silent
    }
  };

  const handleWithdrawStart = () => {
    if (isConnected) {
      Alert.alert('알림', '연결 해제 후 탈퇴할 수 있습니다.\n설정 > 연결 해제를 먼저 진행해주세요.');
      return;
    }
    setShowWithdrawStep1(true);
  };

  const handleWithdrawStep1Confirm = () => {
    setShowWithdrawStep1(false);
    setShowWithdrawStep2(true);
  };

  const handleWithdrawFinal = async () => {
    setShowWithdrawStep2(false);
    try {
      await withdraw(false);
      router.replace('/(auth)/login');
    } catch {
      // silent
    }
  };

  const managementItems: MenuItemData[] = [
    { icon: 'paper-plane-outline', label: '초대/연결 관리', onPress: () => router.push('/(main)/invite-center') },
    { icon: 'notifications-outline', label: '알림 설정', onPress: () => router.push('/(main)/settings/notifications') },
    { icon: 'calendar-outline', label: '기념일', onPress: () => router.push('/(main)/settings/anniversary') },
    { icon: 'person-circle-outline', label: '프로필 수정', onPress: () => router.push('/(main)/settings/profile') },
  ];

  const accountItems: MenuItemData[] = [
    { icon: 'log-out-outline', label: '로그아웃', onPress: () => setShowLogoutConfirm(true) },
    { icon: 'alert-circle-outline', label: '회원탈퇴', onPress: handleWithdrawStart, danger: true },
  ];

  const stats: StatCardData[] = [
    { value: String(visitedCount), label: '갔다 온 곳' },
    { value: String(wishlistCount), label: '위시리스트' },
    ...(dDayText ? [{ value: dDayText, label: map?.anniversaryLabel ?? '기념일' }] : []),
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerTitle}>MY</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(main)/settings/profile')}
          style={styles.profileHero}
        >
          <Avatar
            user={currentUser}
            name={currentUser?.nickname ?? '?'}
            color={colors.accent.primary}
            size={component.avatar.lg}
          />
          <View style={styles.profileInfo}>
            <View style={styles.profileTitleRow}>
              <Text style={styles.nickname}>{currentUser?.nickname ?? '사용자'}</Text>
              <View style={styles.editChip}>
                <Text style={styles.editChipText}>프로필 수정</Text>
              </View>
            </View>
            {isConnected && partner ? (
              <View style={styles.partnerRow}>
                <Ionicons name="heart" size={12} color={colors.accent.primary} />
                <Text style={styles.partnerText}>{partner.nickname}과 함께 지도 공유 중</Text>
              </View>
            ) : (
              <Text style={styles.soloText}>아직 연결되지 않았어요. 초대 코드로 함께 시작해보세요.</Text>
            )}
          </View>
        </TouchableOpacity>

        {isConnected ? (
          <View style={styles.statsGrid}>
            {stats.map((item) => (
              <View key={item.label} style={styles.statCard}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.connectPrompt}>
            <View style={styles.connectTextBlock}>
              <Text style={styles.connectTitle}>상대방과 연결해보세요</Text>
              <Text style={styles.connectDesc}>초대 코드를 공유하거나 받아서 함께 지도를 사용할 수 있어요.</Text>
            </View>
            <Button
              title="연결 관리"
              onPress={() => router.push('/(main)/invite-center')}
              variant="primary"
              size="md"
              fullWidth
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>관리</Text>
          <View style={styles.menuStack}>
            {managementItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuRow}
                onPress={item.onPress}
                activeOpacity={0.75}
              >
                <View style={styles.menuIconFrame}>
                  <Ionicons name={item.icon} size={18} color={colors.text.secondary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {snapshots.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>스냅샷</Text>
            <View style={styles.menuStack}>
              {snapshots.map((snap) => (
                <TouchableOpacity
                  key={snap.snapshotId}
                  style={[styles.menuRow, styles.menuRowComfortable]}
                  onPress={() => router.push(`/snapshot/${snap.snapshotId}`)}
                  activeOpacity={0.75}
                >
                  <View style={styles.menuIconFrame}>
                    <Ionicons name="camera-outline" size={18} color={colors.text.secondary} />
                  </View>
                  <View style={styles.snapshotInfo}>
                    <Text style={styles.menuLabel}>{formatDate(snap.createdAt)}</Text>
                    <Text style={styles.snapshotSub}>{snap.places.length}개 장소</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>계정</Text>
          <View style={styles.menuStack}>
            {accountItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuRow, item.danger && styles.menuRowDanger]}
                onPress={item.onPress}
                activeOpacity={0.75}
              >
                <View style={styles.menuIconFrame}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={item.danger ? colors.accent.danger : colors.text.secondary}
                  />
                </View>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <ConfirmModal
        visible={showLogoutConfirm}
        title="로그아웃"
        message="정말 로그아웃 하시겠습니까?"
        confirmLabel="로그아웃"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
      <ConfirmModal
        visible={showWithdrawStep1}
        title="회원탈퇴"
        message="탈퇴하면 계정, 프로필, 설정, 스냅샷 등 모든 데이터가 삭제됩니다. 계속하시겠습니까?"
        confirmLabel="계속"
        onConfirm={handleWithdrawStep1Confirm}
        onCancel={() => setShowWithdrawStep1(false)}
        danger
      />
      <ConfirmModal
        visible={showWithdrawStep2}
        title="정말 탈퇴하시겠습니까?"
        message="이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제됩니다."
        confirmLabel="탈퇴"
        onConfirm={handleWithdrawFinal}
        onCancel={() => setShowWithdrawStep2(false)}
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
  scrollContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[12],
  },
  headerTitle: {
    ...typography.heading.m,
    color: colors.text.primary,
    paddingTop: spacing[4],
    marginBottom: spacing[5],
  },
  profileHero: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[5],
    gap: spacing[3],
    borderRadius: radius['2xl'],
    backgroundColor: colors.bg.subtle,
  },
  profileInfo: {
    flex: 1,
    gap: spacing[2],
  },
  profileTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  nickname: {
    ...typography.heading.m,
    color: colors.text.primary,
    flex: 1,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  partnerText: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  soloText: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  editChip: {
    height: 30,
    paddingHorizontal: spacing[3],
    borderRadius: radius.full,
    backgroundColor: colors.bg.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editChipText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[4],
  },
  statCard: {
    flex: 1,
    minHeight: 92,
    borderRadius: radius.lg,
    backgroundColor: colors.bg.subtle,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
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
  connectPrompt: {
    marginTop: spacing[4],
    padding: spacing[5],
    borderRadius: radius['2xl'],
    backgroundColor: colors.bg.subtle,
    gap: spacing[4],
  },
  connectTextBlock: {
    gap: spacing[2],
  },
  connectTitle: {
    ...typography.title.m,
    color: colors.text.primary,
  },
  connectDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  section: {
    marginTop: spacing[7],
  },
  sectionLabel: {
    ...typography.body.m,
    color: colors.text.tertiary,
    marginBottom: spacing[3],
  },
  menuStack: {
    gap: spacing[3],
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
    borderRadius: radius.lg,
    backgroundColor: colors.bg.subtle,
  },
  menuRowComfortable: {
    minHeight: 64,
  },
  menuRowDanger: {
    backgroundColor: colors.bg.dangerSoft,
  },
  menuIconFrame: {
    width: component.settingsRow.iconFrame,
    height: component.settingsRow.iconFrame,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    ...typography.body.l,
    color: colors.text.primary,
    flex: 1,
  },
  snapshotInfo: {
    flex: 1,
  },
  snapshotSub: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  menuLabelDanger: {
    color: colors.accent.danger,
  },
  bottomSpacer: {
    height: spacing[8],
  },
});
