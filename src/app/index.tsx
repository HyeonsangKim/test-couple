import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMapStore } from '@/stores/useMapStore';
import { colors, typography, spacing } from '@/theme/tokens';

export default function SplashGateScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const authLoading = useAuthStore((s) => s.isLoading);
  const map = useMapStore((s) => s.map);
  const mapLoading = useMapStore((s) => s.isLoading);

  useEffect(() => {
    if (authLoading || mapLoading) return;

    if (!currentUser) {
      router.replace('/(auth)/login');
    } else if (!isOnboarded || !map) {
      router.replace('/(auth)/welcome');
    } else {
      router.replace('/(tabs)/map');
    }
  }, [authLoading, mapLoading, currentUser, isOnboarded, map]);

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>커플 지도</Text>
      <ActivityIndicator size="large" color={colors.accent.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg.canvas,
  },
  appName: {
    ...typography.display.l,
    color: colors.text.primary,
    marginBottom: spacing[6],
  },
  spinner: {
    marginTop: spacing[4],
  },
});
