import { Stack } from 'expo-router';
import { colors } from '@/theme/tokens';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg.canvas },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="invite-center" />
      <Stack.Screen name="place/[id]" />
      <Stack.Screen name="place/add/search" />
      <Stack.Screen name="place/add/search-configure" />
      <Stack.Screen name="place/add/pin" />
      <Stack.Screen name="place/add/photo" />
      <Stack.Screen
        name="visit/form"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="settings/notifications" />
      <Stack.Screen name="settings/profile" />
      <Stack.Screen name="settings/anniversary" />
      <Stack.Screen name="settings/disconnect" />
      <Stack.Screen name="reconnect/restore" />
    </Stack>
  );
}
