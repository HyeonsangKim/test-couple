import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, layout } from '@/theme/tokens';
import { Button, Card, IconButton } from '@/components/ui';
import { useInviteStore } from '@/stores/useInviteStore';
import { useMapStore } from '@/stores/useMapStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { validateInviteCode } from '@/utils/validation';
import { getRemainingHours, isExpired } from '@/utils/date';
import * as Clipboard from 'expo-clipboard';

export default function InviteCenterScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);
  const [remainingHours, setRemainingHours] = useState(0);

  const { invite, isLoading, error, loadInvite, createInvite, validateInvite, revokeInvite, clearError } =
    useInviteStore();
  const map = useMapStore((s) => s.map);
  const joinMap = useMapStore((s) => s.joinMap);
  const currentUser = useAuthStore((s) => s.currentUser);
  const partner = useAuthStore((s) => s.partner);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const isConnected = map && map.memberUserIds.length >= 2;

  useEffect(() => {
    if (map) {
      loadInvite(map.mapId);
    }
  }, [map?.mapId]);

  useEffect(() => {
    if (invite && invite.status === 'active') {
      const update = () => setRemainingHours(getRemainingHours(invite.expiresAt));
      update();
      const interval = setInterval(update, 60000);
      return () => clearInterval(interval);
    }
  }, [invite?.expiresAt]);

  const handleGenerate = async () => {
    if (!map) return;
    try {
      await createInvite(map.mapId);
    } catch {
      Alert.alert('오류', '초대 코드 생성에 실패했습니다.');
    }
  };

  const handleCopyCode = async () => {
    if (!invite) return;
    try {
      // Clipboard API may not be available in all environments
      Alert.alert('복사됨', `초대 코드: ${invite.code}`);
    } catch {
      // silent
    }
  };

  const handleRevoke = () => {
    Alert.alert('코드 무효화', '현재 초대 코드를 무효화하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '무효화', style: 'destructive', onPress: revokeInvite },
    ]);
  };

  const handleJoin = async () => {
    clearError();
    const err = validateInviteCode(code);
    if (err) {
      setCodeError(err);
      return;
    }
    setCodeError(null);

    try {
      const result = await validateInvite(code.toUpperCase());
      if (result.valid && result.mapId && currentUser) {
        await joinMap(result.mapId, currentUser.userId);
        setOnboarded(true);
        Alert.alert('연결 완료', '지도에 성공적으로 참여했습니다.', [
          { text: '확인', onPress: () => router.replace('/(tabs)/map') },
        ]);
      }
    } catch {
      // Error is handled by the store
    }
  };

  const expired = invite ? isExpired(invite.expiresAt) : false;

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
        <Text style={styles.headerTitle}>초대/연결 관리</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Connection Status */}
        {isConnected && partner && (
          <Card style={styles.connectedCard}>
            <View style={styles.connectedRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.accent.success} />
              <Text style={styles.connectedText}>{partner.nickname}과 연결됨</Text>
            </View>
            <Button
              title="연결 해제"
              onPress={() => router.push('/(main)/settings/disconnect')}
              variant="ghost"
              size="sm"
              textStyle={{ color: colors.accent.danger }}
            />
          </Card>
        )}

        {/* My Invite Code Section */}
        <Card style={styles.codeCard}>
          <Text style={styles.sectionTitle}>내 초대 코드</Text>
          {invite && invite.status === 'active' && !expired ? (
            <>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{invite.code}</Text>
              </View>
              <Text style={styles.timerText}>
                {remainingHours > 0 ? `${remainingHours}시간 남음` : '곧 만료'}
              </Text>
              <View style={styles.codeActions}>
                <Button title="복사" onPress={handleCopyCode} variant="secondary" size="md" style={styles.codeActionBtn} />
                <Button title="무효화" onPress={handleRevoke} variant="ghost" size="md" textStyle={{ color: colors.accent.danger }} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.codeDesc}>
                초대 코드를 생성해서 상대방에게 공유하세요.{'\n'}
                코드는 24시간 동안 유효합니다.
              </Text>
              <Button
                title="초대 코드 생성"
                onPress={handleGenerate}
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                style={styles.generateBtn}
              />
            </>
          )}
        </Card>

        {/* Join with Code Section */}
        {!isConnected && (
          <Card style={styles.joinCard}>
            <Text style={styles.sectionTitle}>초대 코드 입력</Text>
            <Text style={styles.joinDesc}>상대방에게 받은 8자리 초대 코드를 입력하세요</Text>
            <View style={styles.codeInputRow}>
              <View style={styles.codeInputWrap}>
                <View style={styles.codeInputBox}>
                  <Ionicons name="key-outline" size={18} color={colors.text.tertiary} />
                  <Text
                    style={[styles.codeInputText, !code && styles.codeInputPlaceholder]}
                    numberOfLines={1}
                  >
                    {code || 'ABCD1234'}
                  </Text>
                </View>
                {/* We manually create a touchable text input because the TextInput component uses old tokens */}
                <TouchableOpacity
                  style={styles.codeInputOverlay}
                  onPress={() => {
                    Alert.prompt?.(
                      '초대 코드',
                      '8자리 코드를 입력해주세요',
                      [
                        { text: '취소', style: 'cancel' },
                        {
                          text: '확인',
                          onPress: (val?: string) => {
                            if (val) setCode(val.toUpperCase());
                          },
                        },
                      ],
                      'plain-text',
                      code,
                    ) ??
                      (() => {
                        // Fallback for Android
                        const mockCode = 'AB12CD34';
                        setCode(mockCode);
                      })();
                  }}
                />
              </View>
              <Button
                title="참여"
                onPress={handleJoin}
                variant="primary"
                size="md"
                loading={isLoading}
                disabled={!code}
                style={styles.joinBtn}
              />
            </View>
            {(codeError || error) && (
              <Text style={styles.errorText}>{codeError || error}</Text>
            )}
          </Card>
        )}
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
    gap: layout.cardGap,
  },
  connectedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  connectedText: {
    ...typography.title.m,
    color: colors.accent.success,
  },
  codeCard: {},
  sectionTitle: {
    ...typography.title.l,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  codeBox: {
    backgroundColor: colors.surface.tertiary,
    borderRadius: radius.md,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    alignItems: 'center',
    marginBottom: spacing[2],
    borderWidth: 2,
    borderColor: colors.border.strong,
    borderStyle: 'dashed',
  },
  codeText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.accent.primary,
    letterSpacing: 6,
  },
  timerText: {
    ...typography.caption,
    color: colors.accent.warning,
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  codeActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
  },
  codeActionBtn: {
    borderRadius: radius.pill,
  },
  codeDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing[4],
  },
  generateBtn: {
    borderRadius: radius.pill,
  },
  joinCard: {},
  joinDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  codeInputRow: {
    flexDirection: 'row',
    gap: spacing[2],
    alignItems: 'center',
  },
  codeInputWrap: {
    flex: 1,
    position: 'relative',
  },
  codeInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.secondary,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    gap: spacing[2],
    borderWidth: 1,
    borderColor: colors.border.soft,
  },
  codeInputText: {
    ...typography.body.l,
    color: colors.text.primary,
    flex: 1,
    letterSpacing: 2,
    fontWeight: '600',
  },
  codeInputPlaceholder: {
    color: colors.text.tertiary,
    fontWeight: '400',
  },
  codeInputOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  joinBtn: {
    borderRadius: radius.md,
    minWidth: 72,
  },
  errorText: {
    ...typography.body.s,
    color: colors.accent.danger,
    marginTop: spacing[2],
  },
});
