import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { Chip, Button } from '@/components/ui';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { PlaceStatus, Category } from '@/types';
import { STATUS_LABELS, CATEGORY_LABELS, CATEGORIES } from '@/constants';

interface FilterBottomSheetProps {
  onClose: () => void;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ onClose }) => {
  const { filter, setFilter, resetFilter } = usePlaceStore();

  const statusOptions: { key: PlaceStatus | 'all'; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'wishlist', label: '위시리스트' },
    { key: 'visited', label: '갔다 온 곳' },
  ];

  const categoryOptions: { key: Category | 'all'; label: string }[] = [
    { key: 'all', label: '전체' },
    ...CATEGORIES.map((c) => ({ key: c.key, label: `${c.emoji} ${c.label}` })),
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>필터</Text>
        <TouchableOpacity onPress={() => { resetFilter(); }}>
          <Text style={styles.resetBtn}>초기화</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>상태</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {statusOptions.map((opt) => (
          <Chip
            key={opt.key}
            label={opt.label}
            selected={filter.status === opt.key}
            onPress={() => setFilter({ status: opt.key })}
            color={colors.primary}
            style={styles.chip}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>카테고리</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {categoryOptions.map((opt) => (
          <Chip
            key={opt.key}
            label={opt.label}
            selected={filter.category === opt.key}
            onPress={() => setFilter({ category: opt.key })}
            color={colors.secondary}
            style={styles.chip}
          />
        ))}
      </ScrollView>

      <Button
        title="적용"
        onPress={onClose}
        variant="primary"
        size="lg"
        fullWidth
        style={styles.applyBtn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  resetBtn: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  sectionLabel: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  chip: {
    marginRight: spacing.sm,
  },
  applyBtn: {
    marginTop: spacing.xxl,
  },
});
