import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, layout, component } from '@/theme/tokens';
import { Avatar, Card, Button } from '@/components/ui';
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
  danger?: boolean;
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

  const isConnected = map && map.memberUserIds.length >= 2;
  const visitedCount = places.filter((p) => p.status === 'visited').length;
  const wishlistCount = places.filter((p) => p.status === 'wishlist').length;

  // Calculate D-day
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

  const menuItems: MenuItemData[] = [
    {
      icon: 'paper-plane-outline',
      label: '초대/연결 관리',
      onPress: () => router.push('/(main)/invite-center'),
    },
    {
      icon: 'notifications-outline',
      label: '알림 설정',
      onPress: () => router.push('/(main)/settings/notifications'),
    },
    {
      icon: 'calendar-outline',
      label: '기념일',
      onPress: () => router.push('/(main)/settings/anniversary'),
    },
    {
      icon: 'person-circle-outline',
      label: '프로필 수정',
      onPress: () => router.push('/(main)/settings/profile'),
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.headerTitle}>MY</Text>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Avatar
              name={currentUser?.nickname ?? '?'}
              color={colors.accent.primary}
              size={component.avatar.lg}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.nickname}>{currentUser?.nickname ?? '사용자'}</Text>
              {isConnected && partner ? (
                <View style={styles.partnerRow}>
                  <Ionicons name="heart" size={12} color={colors.accent.primary} />
                  <Text style={styles.partnerText}>{partner.nickname}과 함께</Text>
                </View>
              ) : (
                <Text style={styles.soloText}>솔로 모드</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(main)/settings/profile')}
              style={styles.editBtn}
            >
              <Ionicons name="create-outline" size={18} color={colors.text.tertiary} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Connection Status Card */}
        <Card style={styles.statusCard}>
          {isConnected ? (
            <>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{visitedCount}</Text>
                  <Text style={styles.statLabel}>갔다 온 곳</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{wishlistCount}</Text>
                  <Text style={styles.statLabel}>위시리스트</Text>
                </View>
                {dDayText ? (
                  <>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{dDayText}</Text>
                      <Text style={styles.statLabel}>{map?.anniversaryLabel ?? '기념일'}</Text>
                    </View>
                  </>
                ) : null}
              </View>
            </>
          ) : (
            <View style={styles.soloCard}>
              <Ionicons name="people-outline" size={32} color={colors.text.tertiary} />
              <Text style={styles.soloCardTitle}>상대방과 연결해보세요</Text>
              <Text style={styles.soloCardDesc}>
                초대 코드를 공유하거나 받아서 함께 지도를 사용할 수 있어요
              </Text>
              <Button
                title="초대/연결 관리"
                onPress={() => router.push('/(main)/invite-center')}
                variant="primary"
                size="md"
                style={styles.soloCardBtn}
              />
            </View>
          )}
        </Card>

        {/* Menu Items */}
        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <Ionicons name={item.icon} size={20} color={colors.text.secondary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
            </TouchableOpacity>
          ))}
        </Card>

        {/* Snapshots Entry */}
        {snapshots.length > 0 && (
          <Card style={styles.snapshotCard}>
            <Text style={styles.snapshotTitle}>스냅샷</Text>
            {snapshots.map((snap) => (
              <TouchableOpacity
                key={snap.snapshotId}
                style={styles.snapshotItem}
                onPress={() => router.push(`/snapshot/${snap.snapshotId}`)}
                activeOpacity={0.6}
              >
                <View style={styles.snapshotIconFrame}>
                  <Ionicons name="camera-outline" size={20} color={colors.text.secondary} />
                </View>
                <View style={styles.snapshotInfo}>
                  <Text style={styles.snapshotDate}>{formatDate(snap.createdAt)}</Text>
                  <Text style={styles.snapshotPlaces}>{snap.places.length}개 장소</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        )}

        {/* Danger Block */}
        <Card style={styles.dangerCard}>
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() => setShowLogoutConfirm(true)}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
          <View style={styles.dangerDivider} />
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={handleWithdrawStart}
          >
            <Ionicons name="alert-circle-outline" size={20} color={colors.accent.danger} />
            <Text style={styles.withdrawText}>회원탈퇴</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <ConfirmModal
        visible={showLogoutConfirm}
        title="로그아웃"
        message="정말 로그아웃 하시겠습니까?"
        confirmLabel="로그아웃"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {/* Two-step withdrawal confirmation (PRD 5-6) */}
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
    backgroundColor: colors.bg.canvas,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: 120,
  },
  headerTitle: {
    ...typography.heading.l,
    color: colors.text.primary,
    paddingVertical: spacing[3],
  },
  profileCard: {
    backgroundColor: colors.bg.elevated,
    marginBottom: layout.cardGap,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing[3],
  },
  nickname: {
    ...typography.title.l,
    color: colors.text.primary,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    marginTop: 2,
  },
  partnerText: {
    ...typography.body.s,
    color: colors.text.secondary,
  },
  soloText: {
    ...typography.body.s,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  editBtn: {
    padding: spacing[2],
  },
  statusCard: {
    backgroundColor: colors.bg.elevated,
    marginBottom: layout.cardGap,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  statValue: {
    ...typography.heading.m,
    color: colors.accent.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border.soft,
  },
  soloCard: {
    alignItems: 'center',
    paddingVertical: spacing[4],
  },
  soloCardTitle: {
    ...typography.title.m,
    color: colors.text.primary,
    marginTop: spacing[3],
    marginBottom: spacing[1],
  },
  soloCardDesc: {
    ...typography.body.s,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  soloCardBtn: {
    borderRadius: radius.full,
  },
  menuCard: {
    backgroundColor: colors.bg.elevated,
    marginBottom: layout.cardGap,
    paddingVertical: spacing[1],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: component.settingsRow.height,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[1],
    gap: spacing[3],
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.soft,
  },
  menuLabel: {
    ...typography.body.l,
    color: colors.text.primary,
    flex: 1,
  },
  snapshotCard: {
    backgroundColor: colors.bg.elevated,
    marginBottom: layout.cardGap,
  },
  snapshotTitle: {
    ...typography.title.m,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  snapshotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: component.archiveRow.minHeight,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  snapshotIconFrame: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapshotInfo: {
    flex: 1,
  },
  snapshotDate: {
    ...typography.body.m,
    color: colors.text.primary,
  },
  snapshotPlaces: {
    ...typography.body.s,
    color: colors.text.secondary,
    marginTop: 2,
  },
  dangerCard: {
    backgroundColor: colors.status.deleteBg,
    marginBottom: layout.cardGap,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[1],
    gap: spacing[3],
    minHeight: component.settingsRow.height,
  },
  dangerDivider: {
    height: 1,
    backgroundColor: colors.border.soft,
  },
  logoutText: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  withdrawText: {
    ...typography.body.m,
    color: colors.accent.danger,
  },
});
