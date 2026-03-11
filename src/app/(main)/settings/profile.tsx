import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, radius, spacing, typography, component } from '@/theme/tokens';
import { Avatar, Button } from '@/components/ui';
import {
  BottomCtaBar,
  SettingsHeader,
  SettingsSection,
  SettingsSurface,
  SettingsTextField,
} from '@/components/settings';
import { useAuthStore } from '@/stores/useAuthStore';
import { validateNickname } from '@/utils/validation';

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [nickname, setNickname] = useState(currentUser?.nickname ?? '');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(
    currentUser?.profileImageUri ?? null,
  );
  const [loading, setLoading] = useState(false);

  const avatarUser = useMemo(
    () => (currentUser ? { ...currentUser, profileImageUri } : null),
    [currentUser, profileImageUri],
  );

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('오류', '사진을 선택할 수 없습니다.');
    }
  };

  const handleSave = async () => {
    const error = validateNickname(nickname);
    if (error) {
      Alert.alert('알림', error);
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ nickname: nickname.trim(), profileImageUri });
      Alert.alert('완료', '프로필이 수정되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('오류', '프로필 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <SettingsHeader title="프로필 수정" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        <SettingsSurface style={styles.profileHero}>
          <TouchableOpacity activeOpacity={0.8} onPress={handlePickImage} style={styles.avatarButton}>
            <Avatar
              user={avatarUser}
              name={nickname || currentUser?.nickname || '?'}
              color={colors.accent.primary}
              size={component.avatar.xl}
            />
            <View style={styles.avatarBadge}>
              <Ionicons name="camera-outline" size={16} color={colors.text.primary} />
            </View>
          </TouchableOpacity>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>프로필 사진과 닉네임을 정리해보세요</Text>
            <Text style={styles.heroDescription}>
              MY 화면에서 가장 먼저 보이는 정보라서 짧고 또렷하게 두는 편이 좋습니다.
            </Text>
          </View>
        </SettingsSurface>

        <SettingsSection style={styles.section} title="기본 정보">
          <SettingsTextField
            label="닉네임"
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요"
            maxLength={12}
            helperText="상대방과 함께 볼 이름입니다."
            metaText={`${nickname.length}/12`}
          />
        </SettingsSection>
      </ScrollView>

      <BottomCtaBar>
        <Button
          title="저장"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!nickname.trim()}
          style={styles.ctaButton}
        />
      </BottomCtaBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  profileHero: {
    alignItems: 'center',
    gap: spacing[4],
    paddingVertical: spacing[6],
  },
  avatarButton: {
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.bg.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextBlock: {
    alignItems: 'center',
    gap: spacing[2],
  },
  heroTitle: {
    ...typography.title.m,
    color: colors.text.primary,
    textAlign: 'center',
  },
  heroDescription: {
    ...typography.body.m,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
  section: {
    marginTop: spacing[7],
  },
  ctaButton: {
    borderRadius: radius.lg,
  },
});
