import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, component } from '@/theme/tokens';
import { Chip, Button } from '@/components/ui';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { PlaceStatus, PlaceCategory } from '@/types';
import { STATUS_LABELS, CATEGORIES } from '@/constants';

interface FilterBottomSheetProps {
  onClose: () => void;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({ onClose }) => {
  const { filter, setFilter, resetFilter } = usePlaceStore();

  const statusOptions: { key: PlaceStatus | 'all'; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'visited', label: '갔다 온 곳' },
    { key: 'wishlist', label: '위시리스트' },
  ];

  const categoryOptions: { key: PlaceCategory | 'all'; label: string }[] = [
    { key: 'all', label: '전체' },
    ...CATEGORIES.map((c) => ({ key: c.key, label: c.label })),
  ];

  const toggleCategory = (category: PlaceCategory | 'all') => {
    if (category === 'all') {
      setFilter({ category: [] });
      return;
    }

    const nextCategories = filter.category.includes(category)
      ? filter.category.filter((item) => item !== category)
      : [...filter.category, category];

    setFilter({ category: nextCategories });
  };

  return (
    <View style={styles.container}>
      <View style={styles.handle} />
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title}>필터</Text>
          <TouchableOpacity onPress={() => { resetFilter(); }}>
            <Text style={styles.resetBtn}>초기화</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>종류</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {statusOptions.map((opt) => (
            <Chip
              key={opt.key}
              label={opt.label}
              selected={filter.status === opt.key}
              onPress={() => setFilter({ status: opt.key })}
              color={colors.accent.primary}
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
              selected={opt.key === 'all' ? filter.category.length === 0 : filter.category.includes(opt.key)}
              onPress={() => toggleCategory(opt.key)}
              color={colors.accent.primary}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg.elevated,
    borderTopLeftRadius: component.sheet.topRadius,
    borderTopRightRadius: component.sheet.topRadius,
    paddingTop: component.sheet.topPadding,
  },
  handle: {
    width: component.sheet.handleWidth,
    height: component.sheet.handleHeight,
    borderRadius: component.sheet.handleHeight / 2,
    backgroundColor: colors.border.strong,
    alignSelf: 'center',
    marginBottom: spacing[3],
  },
  inner: {
    paddingHorizontal: component.sheet.innerHorizontalPadding,
    paddingBottom: spacing[6],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  title: {
    ...typography.title.l,
    color: colors.text.primary,
  },
  resetBtn: {
    ...typography.title.m,
    color: colors.accent.primary,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing[2],
    marginTop: spacing[4],
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: spacing[4],
  },
  chip: {
    marginRight: spacing[2],
  },
  applyBtn: {
    marginTop: spacing[6],
  },
});
