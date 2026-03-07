import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadow } from '@/theme/tokens';
import { Button } from '@/components/ui';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <Text style={styles.emoji}>🗺️💕</Text>
          <Text style={styles.title}>커플 지도</Text>
          <Text style={styles.subtitle}>
            둘만의 장소를 함께 기록하세요
          </Text>
          <Text style={styles.description}>
            가고 싶은 곳, 다녀온 곳, 추억의 사진과 메모를{'\n'}
            하나의 지도에 모아보세요
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="새 지도 만들기"
            onPress={() => router.push('/(auth)/create-map')}
            variant="primary"
            size="lg"
            fullWidth
          />
          <View style={styles.spacer} />
          <Button
            title="초대 코드로 참여하기"
            onPress={() => router.push('/(auth)/join-map')}
            variant="outline"
            size="lg"
            fullWidth
          />
        </View>

        <Text style={styles.footer}>
          두 사람이 하나의 지도를 함께 사용합니다
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxxl,
  },
  emoji: {
    fontSize: 72,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    marginBottom: spacing.xxxl,
  },
  spacer: {
    height: spacing.md,
  },
  footer: {
    ...typography.caption,
    color: colors.textTertiary,
    textAlign: 'center',
  },
});
