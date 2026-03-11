import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout, spacing, typography } from '@/theme/tokens';
import { SettingsHeader, SettingsSection, SettingsSwitchRow } from '@/components/settings';
import { useAuthStore } from '@/stores/useAuthStore';
import { NOTIFICATION_LABELS } from '@/constants';

type NotificationKey =
  | 'inviteAndConnection'
  | 'visit'
  | 'threadMessage'
  | 'placeDelete'
  | 'disconnect'
  | 'anniversary';

const NOTIFICATION_KEYS: NotificationKey[] = [
  'inviteAndConnection',
  'visit',
  'threadMessage',
  'placeDelete',
  'disconnect',
  'anniversary',
];

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const {
    notificationSettings,
    loadNotificationSettings,
    updateNotificationSettings,
  } = useAuthStore();

  useEffect(() => {
    void loadNotificationSettings();
  }, [loadNotificationSettings]);

  const handleToggle = (key: NotificationKey, nextValue: boolean) => {
    void updateNotificationSettings({ [key]: nextValue });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <SettingsHeader title="알림 설정" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        <SettingsSection
          description="알림은 변경 즉시 저장됩니다. 필요한 항목만 켜두면 더 깔끔하게 사용할 수 있어요."
        >
          <View style={styles.rowStack}>
            {NOTIFICATION_KEYS.map((key) => (
              <SettingsSwitchRow
                key={key}
                label={NOTIFICATION_LABELS[key] ?? key}
                value={notificationSettings?.[key] ?? true}
                onValueChange={(nextValue) => handleToggle(key, nextValue)}
              />
            ))}
          </View>
        </SettingsSection>

        <Text style={styles.helperText}>
          알림을 꺼도 앱 안의 기록과 메시지는 그대로 유지됩니다.
        </Text>
      </ScrollView>
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
  rowStack: {
    gap: spacing[3],
  },
  helperText: {
    ...typography.body.m,
    color: colors.text.tertiary,
    marginTop: spacing[5],
    textAlign: 'center',
    paddingHorizontal: spacing[4],
  },
});
