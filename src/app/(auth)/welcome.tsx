import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, layout } from '@/theme/tokens';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMapStore } from '@/stores/useMapStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const createMap = useMapStore((s) => s.createMap);

  const handleInvite = async () => {
    // PRD: Invite Partner -> create map -> enter PG_INVITE_CENTER
    if (!currentUser) return;
    try {
      await createMap(currentUser.userId);
      setOnboarded(true);
      router.replace('/(main)/invite-center');
    } catch {
      // silent
    }
  };

  const handleJoinWithCode = () => {
    router.push('/(main)/invite-center');
  };

  const handleStartSolo = async () => {
    if (!currentUser) return;
    try {
      await createMap(currentUser.userId);
      setOnboarded(true);
      router.replace('/(tabs)/map');
    } catch {
      // silent
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="map" size={40} color={colors.accent.primary} />
          </View>
          <Text style={styles.title}>시작하기</Text>
          <Text style={styles.subtitle}>
            커플 지도를 시작하는 방법을 선택해주세요
          </Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={[styles.optionCard, styles.inviteOptionCard]}
            onPress={handleInvite}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconCircle}>
              <Ionicons name="paper-plane-outline" size={24} color={colors.accent.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>초대하기</Text>
              <Text style={styles.optionDesc}>새 지도를 만들고 상대방을 초대해요</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleJoinWithCode} activeOpacity={0.7}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="enter-outline" size={24} color={colors.accent.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>초대받기</Text>
              <Text style={styles.optionDesc}>초대 코드로 상대방의 지도에 참여해요</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionCard} onPress={handleStartSolo} activeOpacity={0.7}>
            <View style={styles.optionIconCircle}>
              <Ionicons name="person-outline" size={24} color={colors.text.tertiary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>나중에 연결하고 먼저 시작</Text>
              <Text style={styles.optionDesc}>혼자 먼저 장소를 기록해요</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
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
    paddingHorizontal: layout.screenPaddingH,
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing[10],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.bg.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
    ...shadow.sm,
  },
  title: {
    ...typography.heading.l,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.body.m,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  options: {
    gap: layout.cardGap,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.xl,
    padding: spacing[5],
    ...shadow.sm,
  },
  inviteOptionCard: {
    borderWidth: 2,
    borderColor: colors.accent.primarySoft,
  },
  optionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bg.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    ...typography.title.m,
    color: colors.text.primary,
    marginBottom: 2,
  },
  optionDesc: {
    ...typography.body.s,
    color: colors.text.secondary,
  },
});
