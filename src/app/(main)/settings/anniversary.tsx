import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, layout, radius, spacing, typography } from '@/theme/tokens';
import { Button } from '@/components/ui';
import { DatePicker } from '@/components/common/DatePicker';
import {
  BottomCtaBar,
  SettingsHeader,
  SettingsSection,
  SettingsSurface,
  SettingsTextField,
} from '@/components/settings';
import { useMapStore } from '@/stores/useMapStore';

export default function AnniversarySettingsScreen() {
  const router = useRouter();
  const map = useMapStore((s) => s.map);
  const updateAnniversary = useMapStore((s) => s.updateAnniversary);

  const [date, setDate] = useState(map?.anniversaryDate ?? '');
  const [label, setLabel] = useState(map?.anniversaryLabel ?? '');
  const [loading, setLoading] = useState(false);

  let dDayPreview = '';
  if (date) {
    const today = new Date();
    const anniv = new Date(date);
    const diffMs = today.getTime() - anniv.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    dDayPreview = diffDays >= 0 ? `D+${diffDays}` : `D${diffDays}`;
  }

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateAnniversary(date || null, label.trim() || null);
      Alert.alert('완료', '기념일이 저장되었습니다.', [
        { text: '확인', onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert('오류', '기념일 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      await updateAnniversary(null, null);
      setDate('');
      setLabel('');
      Alert.alert('완료', '기념일이 삭제되었습니다.');
    } catch {
      Alert.alert('오류', '삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <SettingsHeader title="기념일" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
        {dDayPreview ? (
          <SettingsSurface style={styles.previewSurface}>
            <Text style={styles.previewLabel}>{label || '기념일'}</Text>
            <Text style={styles.previewDDay}>{dDayPreview}</Text>
            <Text style={styles.previewDescription}>MY 화면과 상세 페이지에 함께 표시됩니다.</Text>
          </SettingsSurface>
        ) : null}

        <SettingsSection style={styles.section} title="기본 정보">
          <View style={styles.fieldStack}>
            <DatePicker value={date} onChange={setDate} label="기념일 날짜" />
            <SettingsTextField
              label="기념일 이름"
              value={label}
              onChangeText={setLabel}
              placeholder="예: 처음 만난 날, 100일"
              maxLength={20}
              helperText="짧은 이름으로 두면 리스트에서 더 잘 읽혀요."
              metaText={`${label.length}/20`}
            />
          </View>
        </SettingsSection>

        {map?.anniversaryDate ? (
          <SettingsSection style={styles.section} title="관리">
            <SettingsSurface tone="danger">
              <TouchableOpacity activeOpacity={0.7} onPress={handleClear} style={styles.clearAction}>
                <Text style={styles.clearActionText}>기념일 삭제</Text>
                <Text style={styles.clearActionHelper}>삭제하면 D-day 표시도 함께 사라집니다.</Text>
              </TouchableOpacity>
            </SettingsSurface>
          </SettingsSection>
        ) : null}
      </ScrollView>

      <BottomCtaBar>
        <Button
          title="저장"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
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
  previewSurface: {
    alignItems: 'center',
    gap: spacing[1],
    paddingVertical: spacing[6],
  },
  previewLabel: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  previewDDay: {
    ...typography.display.m,
    color: colors.accent.primary,
  },
  previewDescription: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  section: {
    marginTop: spacing[7],
  },
  fieldStack: {
    gap: spacing[4],
  },
  clearAction: {
    gap: spacing[1],
  },
  clearActionText: {
    ...typography.body.l,
    color: colors.accent.danger,
  },
  clearActionHelper: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  ctaButton: {
    borderRadius: radius.lg,
  },
});
