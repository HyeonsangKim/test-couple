import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow } from '@/theme/tokens';
import { Button } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const init = useAuthStore((s) => s.init);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await init();
      router.replace('/(auth)/welcome');
    } catch {
      // handle error silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="map" size={48} color={colors.accent.primary} />
          </View>
          <Text style={styles.title}>커플 지도</Text>
          <Text style={styles.subtitle}>둘만의 장소를 함께 기록하세요</Text>
        </View>

        <View style={styles.loginSection}>
          <Button
            title="Google로 시작하기"
            onPress={handleGoogleLogin}
            variant="fill-primary"
            size="lg"
            fullWidth
            loading={loading}
            style={styles.googleBtn}
          />
          <Text style={styles.footerText}>
            로그인하면 서비스 약관에 동의하는 것으로 간주합니다
          </Text>
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
  container: {
    flex: 1,
    paddingHorizontal: spacing[5],
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing[12],
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    ...shadow.sm,
  },
  title: {
    ...typography.display.l,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.body.l,
    color: colors.text.secondary,
  },
  loginSection: {
    alignItems: 'center',
  },
  googleBtn: {
    borderRadius: radius['2xl'],
    marginBottom: spacing[4],
  },
  footerText: {
    ...typography.body.s,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
