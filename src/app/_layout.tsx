import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMapStore } from '@/stores/useMapStore';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { colors } from '@/theme/tokens';
import { CURRENT_USER_ID } from '@/mock/data';

export default function RootLayout() {
  const init = useAuthStore((s) => s.init);
  const loadMap = useMapStore((s) => s.loadMap);
  const loadPartner = useAuthStore((s) => s.loadPartner);
  const map = useMapStore((s) => s.map);
  const loadPlaces = usePlaceStore((s) => s.loadPlaces);
  const loadAllVisits = useVisitStore((s) => s.loadAllVisits);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await init();
        await loadMap(CURRENT_USER_ID);
      } catch {
        // silent
      }
    };
    bootstrap();
  }, []);

  const processExpiredDeleteRequests = usePlaceStore((s) => s.processExpiredDeleteRequests);

  useEffect(() => {
    if (map) {
      try {
        loadPartner(map.memberUserIds);
        loadPlaces(map.mapId);
        loadAllVisits();
        // PRD 5-2: Process expired delete requests on app start
        processExpiredDeleteRequests(map.mapId);
      } catch {
        // silent
      }
    }
  }, [map?.mapId]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg.canvas },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen
          name="snapshot/[id]"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
