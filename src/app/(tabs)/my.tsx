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
    { icon: 'paper-plane-outline', label: '초대/연결 관리', onPress: () => router.push('/(main)/invite-center') },
    { icon: 'notifications-outline', label: '알림 설정', onPress: () => router.push('/(main)/settings/notifications') },
    { icon: 'calendar-outline', label: '기념일', onPress: () => router.push('/(main)/settings/anniversary') },
    { icon: 'person-circle-outline', label: '프로필 수정', onPress: () => router.push('/(main)/settings/profile') },
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

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Avatar
            name={currentUser?.nickname ?? '?'}
            color={colors.accent.primary}
            size={component.avatar.lg}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.nickname}>{currentUser?.nickname ?? '사용자'}</Text>
            {isConnected && partner ? (
              <View style={styles.partnerRow}>
                <Ionicons name="heart" size={11} color={colors.accent.primary} />
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

        <View style={styles.sectionDivider} />

        {/* Stats / Connection */}
        {isConnected ? (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{visitedCount}</Text>
              <Text style={styles.statLabel}>갔다 온 곳</Text>
            </View>
            <View style={styles.statVertDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{wishlistCount}</Text>
              <Text style={styles.statLabel}>위시리스트</Text>
            </View>
            {dDayText ? (
              <>
                <View style={styles.statVertDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{dDayText}</Text>
                  <Text style={styles.statLabel}>{map?.anniversaryLabel ?? '기념일'}</Text>
                </View>
              </>
            ) : null}
          </View>
        ) : (
          <View style={styles.connectPrompt}>
            <View style={styles.connectTextBlock}>
              <Text style={styles.connectTitle}>상대방과 연결해보세요</Text>
              <Text style={styles.connectDesc}>초대 코드를 공유하거나 받아서 함께 지도를 사용할 수 있어요</Text>
            </View>
            <Button
              title="연결 관리"
              onPress={() => router.push('/(main)/invite-center')}
              variant="primary"
              size="md"
            />
          </View>
        )}

        <View style={styles.sectionDivider} />

        {/* Menu Group */}
        <View style={styles.menuGroup}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={item.onPress}
                activeOpacity={0.6}
              >
                <View style={styles.menuIconFrame}>
                  <Ionicons name={item.icon} size={18} color={colors.text.secondary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.rowDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Snapshots */}
        {snapshots.length > 0 && (
          <>
            <View style={styles.sectionDivider} />
            <View style={styles.menuGroup}>
              <Text style={styles.sectionLabel}>스냅샷</Text>
              {snapshots.map((snap, index) => (
                <React.Fragment key={snap.snapshotId}>
                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() => router.push(`/snapshot/${snap.snapshotId}`)}
                    activeOpacity={0.6}
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
                  {index < snapshots.length - 1 && <View style={styles.rowDivider} />}
                </React.Fragment>
              ))}
            </View>
          </>
        )}

        <View style={styles.sectionDivider} />

        {/* Danger Group */}
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => setShowLogoutConfirm(true)}
            activeOpacity={0.6}
          >
            <View style={styles.menuIconFrame}>
              <Ionicons name="log-out-outline" size={18} color={colors.text.secondary} />
            </View>
            <Text style={styles.menuLabel}>로그아웃</Text>
          </TouchableOpacity>
          <View style={styles.rowDivider} />
          <TouchableOpacity
            style={styles.menuRow}
            onPress={handleWithdrawStart}
            activeOpacity={0.6}
          >
            <View style={styles.menuIconFrame}>
              <Ionicons name="alert-circle-outline" size={18} color={colors.accent.danger} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.accent.danger }]}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: spacing[12] }} />
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
    paddingBottom: 32,
  },
  headerTitle: {
    ...typography.heading.m,
    color: colors.text.primary,
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[4],
    paddingBottom: spacing[3],
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  profileInfo: {
    flex: 1,
  },
  nickname: {
    ...typography.title.l,
    color: colors.text.primary,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  partnerText: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  soloText: {
    ...typography.body.m,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  editBtn: {
    padding: spacing[2],
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.line.default,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: layout.screenPaddingH,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.title.l,
    color: colors.accent.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statVertDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.line.default,
  },
  connectPrompt: {
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  connectTextBlock: {
    gap: 4,
  },
  connectTitle: {
    ...typography.title.m,
    color: colors.text.primary,
  },
  connectDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  menuGroup: {
    paddingHorizontal: layout.screenPaddingH,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    paddingVertical: spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: component.settingsRow.height,
    gap: spacing[3],
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
  rowDivider: {
    height: 1,
    backgroundColor: colors.line.default,
    marginLeft: component.settingsRow.iconFrame + spacing[3],
  },
});
