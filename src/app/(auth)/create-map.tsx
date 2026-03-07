import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/theme/tokens';
import { Button, TextInput, IconButton } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMapStore } from '@/stores/useMapStore';

export default function CreateMapScreen() {
  const router = useRouter();
  const [mapName, setMapName] = useState('우리의 지도');
  const [loading, setLoading] = useState(false);
  const currentUser = useAuthStore((s) => s.currentUser);
  const createMap = useMapStore((s) => s.createMap);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleCreate = async () => {
    if (!mapName.trim() || !currentUser) return;
    setLoading(true);
    try {
      await createMap(mapName.trim(), currentUser.id);
      setOnboarded(true);
      router.replace('/(main)/map-home');
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
          <IconButton icon="chevron-back" onPress={() => router.back()} />
        </View>
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Ionicons name="map-outline" size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>새 지도 만들기</Text>
          <Text style={styles.description}>
            두 사람의 공유 지도에 이름을 지어주세요
          </Text>

          <TextInput
            label="지도 이름"
            value={mapName}
            onChangeText={setMapName}
            placeholder="예: 우리의 지도"
            maxLength={20}
            containerStyle={styles.input}
          />

          <Button
            title="지도 만들기"
            onPress={handleCreate}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!mapName.trim()}
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
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  input: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
});
