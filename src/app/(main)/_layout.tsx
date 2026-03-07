import { Stack } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="map-home" />
      <Stack.Screen name="place/[id]" />
      <Stack.Screen
        name="visit/create"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="visit/[id]"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="settings/invite" />
      <Stack.Screen name="settings/disconnect" />
    </Stack>
  );
}
