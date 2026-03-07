import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { Button, IconButton, TextInput } from '@/components/ui';
import { InviteCodeDisplay } from '@/components/invite/InviteCodeDisplay';
import { useInviteStore } from '@/stores/useInviteStore';
import { useMapStore } from '@/stores/useMapStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { validatePassword } from '@/utils/validation';

export default function InviteSettingsScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState<string | null>(null);

  const { invite, isLoading, loadInvite, createInvite, revokeInvite } = useInviteStore();
  const map = useMapStore((s) => s.map);
  const currentUser = useAuthStore((s) => s.currentUser);
  const partner = useAuthStore((s) => s.partner);

  useEffect(() => {
    if (map) loadInvite(map.id);
  }, [map?.id]);

  const handleCreate = async () => {
    const err = validatePassword(password);
    setPwError(err);
    if (err || !map || !currentUser) return;

    await createInvite(map.id, currentUser.id, password);
    setPassword('');
  };

  const handleRevoke = () => {
    Alert.alert('코드 무효화', '현재 초대 코드를 무효화하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '무효화', style: 'destructive', onPress: revokeInvite },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>초대 관리</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {partner && (
          <View style={styles.partnerInfo}>
            <Text style={styles.partnerLabel}>현재 파트너</Text>
            <Text style={styles.partnerName}>{partner.nickname}</Text>
          </View>
        )}

        {invite ? (
          <InviteCodeDisplay invite={invite} onRevoke={handleRevoke} />
        ) : (
          <View style={styles.createSection}>
            <Text style={styles.createTitle}>새 초대 코드 만들기</Text>
            <Text style={styles.createDesc}>
              초대 코드를 생성하면 상대방이 24시간 내에 참여할 수 있어요.
            </Text>
            <TextInput
              label="비밀번호"
              value={password}
              onChangeText={(t) => { setPassword(t); setPwError(null); }}
              placeholder="4자 이상 입력"
              secureTextEntry
              error={pwError}
              containerStyle={styles.pwInput}
            />
            <Button
              title="초대 코드 생성"
              onPress={handleCreate}
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!password}
            />
          </View>
        )}

        <View style={styles.disconnectSection}>
          <Button
            title="연결 해제"
            onPress={() => router.push('/(main)/settings/disconnect')}
            variant="ghost"
            size="md"
            textStyle={{ color: colors.deleteRed }}
          />
        </View>
      </View>
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
  content: { flex: 1, padding: spacing.xxl },
  partnerInfo: {
    backgroundColor: colors.secondaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  partnerLabel: { ...typography.caption, color: colors.secondary },
  partnerName: { ...typography.h3, color: colors.secondary, marginTop: spacing.xs },
  createSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
  },
  createTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  createDesc: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 22 },
  pwInput: { marginBottom: spacing.xl },
  disconnectSection: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
});
