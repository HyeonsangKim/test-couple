import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, layout, component } from '@/theme/tokens';
import { IconButton, Card } from '@/components/ui';
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
    loadNotificationSettings();
  }, []);

  const handleToggle = (key: NotificationKey) => {
    if (!notificationSettings) return;
    const currentValue = notificationSettings[key];
    updateNotificationSettings({ [key]: !currentValue });
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
        <Text style={styles.headerTitle}>알림 설정</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          {NOTIFICATION_KEYS.map((key, index) => (
            <View
              key={key}
              style={[
                styles.row,
                index < NOTIFICATION_KEYS.length - 1 && styles.rowBorder,
              ]}
            >
              <Text style={styles.label}>
                {NOTIFICATION_LABELS[key] ?? key}
              </Text>
              <Switch
                value={notificationSettings?.[key] ?? true}
                onValueChange={() => handleToggle(key)}
                trackColor={{
                  false: colors.border.strong,
                  true: colors.accent.primary,
                }}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </Card>

        <Text style={styles.footerText}>
          알림을 끄면 해당 항목의 푸시 알림을 받지 않습니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.canvas,
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
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[4],
  },
  card: {
    paddingVertical: spacing[1],
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: component.toggleRow.height,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[1],
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.soft,
  },
  label: {
    ...typography.body.l,
    color: colors.text.primary,
  },
  footerText: {
    ...typography.body.s,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[6],
    paddingHorizontal: spacing[4],
  },
});
