import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, radius, layout } from "@/theme/tokens";
import { Button, Card } from "@/components/ui";
import { AppHeader } from "@/components/common/AppHeader";
import { useInviteStore } from "@/stores/useInviteStore";
import { useMapStore } from "@/stores/useMapStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { validateInviteCode } from "@/utils/validation";
import { getRemainingHours, isExpired } from "@/utils/date";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";

export default function InviteCenterScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [remainingHours, setRemainingHours] = useState(0);
  const [showRejoinConfirm, setShowRejoinConfirm] = useState(false);
  const [pendingJoin, setPendingJoin] = useState<{
    mapId: string;
    inviteCodeId: string;
  } | null>(null);

  const {
    invite,
    isLoading,
    error,
    loadInvite,
    createInvite,
    validateInvite,
    consumeInvite,
    revokeInvite,
    clearError,
  } = useInviteStore();
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
    if (invite && invite.status === "active") {
      const update = () =>
        setRemainingHours(getRemainingHours(invite.expiresAt));
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
      Alert.alert("오류", "초대 코드 생성에 실패했습니다.");
    }
  };

  const handleCopyCode = async () => {
    if (!invite) return;
    try {
      await Clipboard.setStringAsync(invite.code);
      Alert.alert("복사됨", `초대 코드: ${invite.code}`);
    } catch {
      // silent
    }
  };

  const handleRevoke = () => {
    Alert.alert("코드 무효화", "현재 초대 코드를 무효화하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "무효화",
        style: "destructive",
        onPress: () => {
          if (map) revokeInvite(map.mapId);
        },
      },
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
      if (result.valid && result.mapId && result.inviteCodeId && currentUser) {
        if (isConnected) {
          setPendingJoin({
            mapId: result.mapId,
            inviteCodeId: result.inviteCodeId,
          });
          setShowRejoinConfirm(true);
        } else {
          try {
            await joinMap(result.mapId, currentUser.userId);
            await consumeInvite(result.inviteCodeId, currentUser.userId);
            setOnboarded(true);
            Alert.alert("연결 완료", "지도에 성공적으로 참여했습니다.", [
              { text: "확인", onPress: () => router.replace("/(tabs)/map") },
            ]);
          } catch {
            Alert.alert("오류", "지도 참여에 실패했습니다.");
          }
        }
      }
    } catch {
      // Error is handled by the store
    }
  };

  const handleConfirmRejoin = async () => {
    if (!pendingJoin || !currentUser) return;
    setShowRejoinConfirm(false);
    try {
      await joinMap(pendingJoin.mapId, currentUser.userId);
      await consumeInvite(pendingJoin.inviteCodeId, currentUser.userId);
      setOnboarded(true);
      Alert.alert("연결 완료", "새로운 지도에 참여했습니다.", [
        { text: "확인", onPress: () => router.replace("/(tabs)/map") },
      ]);
    } catch {
      Alert.alert("오류", "지도 참여에 실패했습니다.");
    } finally {
      setPendingJoin(null);
    }
  };

  const expired = invite ? isExpired(invite.expiresAt) : false;

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader title="초대/연결 관리" onBack={() => router.back()} />

      <View style={styles.content}>
        {/* Connection Status */}
        {isConnected && partner && (
          <Card style={styles.connectedCard}>
            <View style={styles.connectedRow}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.accent.mint}
              />
              <Text style={styles.connectedText}>
                {partner.nickname}과 연결됨
              </Text>
            </View>
            <Button
              title="연결 해제"
              onPress={() => router.push("/(main)/settings/disconnect")}
              variant="ghost-danger"
              size="sm"
            />
          </Card>
        )}

        {/* My Invite Code Section */}
        <Card style={styles.codeCard}>
          <Text style={styles.sectionTitle}>내 초대 코드</Text>
          {invite && invite.status === "active" && !expired ? (
            <>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{invite.code}</Text>
              </View>
              <Text style={styles.timerText}>
                {remainingHours > 0 ? `${remainingHours}시간 남음` : "곧 만료"}
              </Text>
              <View style={styles.codeActions}>
                <Button
                  title="복사"
                  onPress={handleCopyCode}
                  variant="soft-secondary"
                  size="md"
                />
                <Button
                  title="무효화"
                  onPress={handleRevoke}
                  variant="ghost-danger"
                  size="md"
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.codeDesc}>
                초대 코드를 생성해서 상대방에게 공유하세요.{"\n"}
                코드는 24시간 동안 유효합니다.
              </Text>
              <Button
                title="초대 코드 생성"
                onPress={handleGenerate}
                variant="fill-primary"
                size="lg"
                fullWidth
                loading={isLoading}
              />
            </>
          )}
        </Card>

        {/* Join with Code Section */}
        <Card style={styles.joinCard}>
          <Text style={styles.sectionTitle}>초대 코드 입력</Text>
          <Text style={styles.joinDesc}>
            상대방에게 받은 8자리 초대 코드를 입력하세요
          </Text>
          <RNTextInput
            style={styles.codeInput}
            value={code}
            onChangeText={(val) => setCode(val.toUpperCase())}
            placeholder="ABCD1234"
            placeholderTextColor={colors.text.tertiary}
            autoCapitalize="characters"
            maxLength={8}
            showSoftInputOnFocus
          />
          <Button
            title="참여하기"
            onPress={handleJoin}
            variant="fill-primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={!code}
          />
          {(codeError || error) && (
            <Text style={styles.errorText}>{codeError || error}</Text>
          )}
        </Card>
      </View>

      {/* Destructive rejoin confirmation */}
      <ConfirmModal
        visible={showRejoinConfirm}
        title="지도 변경"
        message={`현재 ${partner?.nickname ?? "파트너"}와 공유 중인 지도가 삭제되고 새로운 지도로 전환됩니다. 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="전환"
        onConfirm={handleConfirmRejoin}
        onCancel={() => {
          setShowRejoinConfirm(false);
          setPendingJoin(null);
        }}
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
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingH,
    gap: layout.cardGap,
  },
  connectedCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  connectedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  connectedText: {
    ...typography.title.m,
    color: colors.accent.mint,
  },
  codeCard: {
    backgroundColor: colors.bg.elevated,
  },
  sectionTitle: {
    ...typography.title.l,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  codeBox: {
    backgroundColor: colors.bg.soft,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    alignItems: "center",
    marginBottom: spacing[2],
  },
  codeText: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.accent.primary,
    letterSpacing: 6,
  },
  timerText: {
    ...typography.caption,
    color: colors.accent.amber,
    textAlign: "center",
    marginBottom: spacing[3],
  },
  codeActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[3],
  },
  codeDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: spacing[4],
  },
  joinCard: {
    backgroundColor: colors.bg.elevated,
  },
  joinDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  codeInput: {
    ...typography.body.l,
    color: colors.text.primary,
    backgroundColor: colors.bg.soft,
    borderRadius: radius.lg,
    height: 56,
    paddingHorizontal: spacing[4],
    letterSpacing: 2,
    fontWeight: "600",
    marginBottom: spacing[4],
  },
  errorText: {
    ...typography.body.s,
    color: colors.accent.danger,
    marginTop: spacing[2],
  },
});
