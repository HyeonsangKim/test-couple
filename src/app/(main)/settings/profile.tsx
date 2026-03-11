import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TextInput as RNTextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, layout, component } from '@/theme/tokens';
import { Button, IconButton, Avatar, Card } from '@/components/ui';
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
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-back"
          onPress={() => router.back()}
          size={40}
          backgroundColor={colors.bg.elevated}
          color={colors.text.primary}
        />
        <Text style={styles.headerTitle}>프로필 수정</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Profile Image */}
        <View style={styles.avatarSection}>
          <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickImage}>
            <Avatar
              name={nickname || currentUser?.nickname || '?'}
              color={colors.accent.primary}
              size={component.avatar.xl}
            />
            <View style={styles.avatarBadge}>
              <Ionicons name="camera" size={14} color={colors.text.inverse} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>탭하여 프로필 사진 변경</Text>
        </View>

        {/* Nickname */}
        <Card style={styles.inputCard}>
          <Text style={styles.inputLabel}>닉네임</Text>
          <RNTextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor={colors.text.tertiary}
            maxLength={12}
          />
          <Text style={styles.charCount}>{nickname.length}/12</Text>
        </Card>
      </View>

      {/* Fixed Footer Save Button */}
      <View style={styles.footer}>
        <Button
          title="저장"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          disabled={!nickname.trim()}
          style={styles.saveBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
  },
  headerTitle: {
    ...typography.title.l,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[8],
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing[2],
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg.base,
  },
  avatarHint: {
    ...typography.body.s,
    color: colors.text.tertiary,
  },
  inputCard: {
    marginBottom: spacing[6],
  },
  inputLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: spacing[2],
  },
  input: {
    ...typography.body.l,
    color: colors.text.primary,
    backgroundColor: colors.bg.subtle,
    borderRadius: radius.md,
    height: 48,
    paddingHorizontal: spacing[4],
  },
  charCount: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: spacing[1],
  },
  footer: {
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.line.default,
    backgroundColor: colors.bg.base,
  },
  saveBtn: {
    borderRadius: radius['2xl'],
  },
});
