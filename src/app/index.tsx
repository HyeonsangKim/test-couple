import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMapStore } from '@/stores/useMapStore';
import { colors } from '@/theme/tokens';

export default function Index() {
  const router = useRouter();
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const authLoading = useAuthStore((s) => s.isLoading);
  const map = useMapStore((s) => s.map);
  const mapLoading = useMapStore((s) => s.isLoading);

  useEffect(() => {
    if (authLoading || mapLoading) return;

    if (!isOnboarded || !map) {
      router.replace('/(auth)/welcome');
    } else {
      router.replace('/(main)/map-home');
    }
  }, [authLoading, mapLoading, isOnboarded, map]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
