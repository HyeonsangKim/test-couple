import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '@/theme/tokens';
import { Button, TextInput, IconButton } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMapStore } from '@/stores/useMapStore';
import { useInviteStore } from '@/stores/useInviteStore';
import { validateInviteCode, validatePassword } from '@/utils/validation';

export default function JoinMapScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const currentUser = useAuthStore((s) => s.currentUser);
  const joinMap = useMapStore((s) => s.joinMap);
  const validateInvite = useInviteStore((s) => s.validateInvite);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const inviteError = useInviteStore((s) => s.error);

  const handleJoin = async () => {
    const ce = validateInviteCode(code);
    const pe = validatePassword(password);
    setCodeError(ce);
    setPwError(pe);
    if (ce || pe || !currentUser) return;

    setLoading(true);
    try {
      const result = await validateInvite(code.toUpperCase(), password);
      if (result.valid && result.mapId) {
        await joinMap(result.mapId, currentUser.id);
        setOnboarded(true);
        router.replace('/(main)/map-home');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <IconButton icon="←" onPress={() => router.back()} />
        </View>
        <View style={styles.container}>
          <Text style={styles.emoji}>💌</Text>
          <Text style={styles.title}>초대받기</Text>
          <Text style={styles.description}>
            상대방에게 받은 초대 코드와{'\n'}비밀번호를 입력해주세요
          </Text>

          <TextInput
            label="초대 코드"
            value={code}
            onChangeText={(t) => { setCode(t.toUpperCase()); setCodeError(null); }}
            placeholder="6자리 코드"
            maxLength={6}
            autoCapitalize="characters"
            error={codeError}
            containerStyle={styles.input}
          />

          <TextInput
            label="비밀번호"
            value={password}
            onChangeText={(t) => { setPassword(t); setPwError(null); }}
            placeholder="비밀번호 입력"
            secureTextEntry
            error={pwError}
            containerStyle={styles.input}
          />

          {inviteError && (
            <Text style={styles.errorText}>{inviteError}</Text>
          )}

          <Button
            title="참여하기"
            onPress={handleJoin}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!code || !password}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  header: {
    padding: spacing.lg,
  },
  container: {
    flex: 1,
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginBottom: spacing.lg,
  },
});
