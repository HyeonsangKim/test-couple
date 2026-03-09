import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput as RNTextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, layout } from '@/theme/tokens';
import { Button, IconButton, Card } from '@/components/ui';
import { DatePicker } from '@/components/common/DatePicker';
import { useMapStore } from '@/stores/useMapStore';

export default function AnniversarySettingsScreen() {
  const router = useRouter();
  const map = useMapStore((s) => s.map);
  const updateAnniversary = useMapStore((s) => s.updateAnniversary);

  const [date, setDate] = useState(map?.anniversaryDate ?? '');
  const [label, setLabel] = useState(map?.anniversaryLabel ?? '');
  const [loading, setLoading] = useState(false);

  // Calculate D-day preview
  let dDayPreview = '';
  if (date) {
    const today = new Date();
    const anniv = new Date(date);
    const diffMs = today.getTime() - anniv.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays >= 0) {
      dDayPreview = `D+${diffDays}`;
    } else {
      dDayPreview = `D${diffDays}`;
    }
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
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="chevron-back"
          onPress={() => router.back()}
          size={40}
          backgroundColor={colors.surface.primary}
          color={colors.text.primary}
        />
        <Text style={styles.headerTitle}>기념일</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* D-day Preview */}
        {dDayPreview ? (
          <Card style={styles.previewCard}>
            <Text style={styles.previewDDay}>{dDayPreview}</Text>
            <Text style={styles.previewLabel}>{label || '기념일'}</Text>
          </Card>
        ) : null}

        {/* Date */}
        <View style={styles.section}>
          <DatePicker value={date} onChange={setDate} label="기념일 날짜" />
        </View>

        {/* Label */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>기념일 이름</Text>
          <RNTextInput
            style={styles.input}
            value={label}
            onChangeText={setLabel}
            placeholder="예: 처음 만난 날, 100일"
            placeholderTextColor={colors.text.tertiary}
            maxLength={20}
          />
        </View>

        {/* Actions */}
        <Button
          title="저장"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          style={styles.saveBtn}
        />

        {map?.anniversaryDate && (
          <Button
            title="기념일 삭제"
            onPress={handleClear}
            variant="ghost"
            size="md"
            textStyle={{ color: colors.accent.danger }}
            style={styles.clearBtn}
          />
        )}
      </View>
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
  content: {
    flex: 1,
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[4],
  },
  previewCard: {
    alignItems: 'center',
    marginBottom: spacing[6],
    paddingVertical: spacing[6],
  },
  previewDDay: {
    ...typography.display.l,
    color: colors.accent.primary,
    marginBottom: spacing[1],
  },
  previewLabel: {
    ...typography.body.l,
    color: colors.text.secondary,
  },
  section: {
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
    backgroundColor: colors.surface.primary,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.border.soft,
  },
  saveBtn: {
    borderRadius: radius.pill,
    marginTop: spacing[4],
  },
  clearBtn: {
    marginTop: spacing[4],
    alignSelf: 'center',
  },
});
