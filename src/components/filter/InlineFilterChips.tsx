import React, { useCallback } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Chip } from '@/components/ui';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { layout, spacing } from '@/theme/tokens';
import { PlaceStatus } from '@/types';

interface InlineFilterChipsProps {
  onOpenFilter: () => void;
  style?: ViewStyle;
}

const STATUS_CHIPS: { key: PlaceStatus; label: string }[] = [
  { key: 'visited', label: '갔다 온 곳' },
  { key: 'wishlist', label: '위시리스트' },
];

export const InlineFilterChips: React.FC<InlineFilterChipsProps> = ({
  onOpenFilter,
  style,
}) => {
  const { filter, setFilter } = usePlaceStore();

  const toggleStatus = useCallback((status: PlaceStatus) => {
    setFilter({ status: filter.status === status ? 'all' : status });
  }, [filter.status, setFilter]);

  return (
    <View style={[styles.row, style]}>
      {STATUS_CHIPS.map((chip) => (
        <Chip
          key={chip.key}
          label={chip.label}
          selected={filter.status === chip.key}
          selectionStyle="solidAccent"
          onPress={() => toggleStatus(chip.key)}
          style={styles.chip}
        />
      ))}
      <Chip
        label="필터"
        selected={filter.category.length > 0}
        selectionStyle="solidAccent"
        onPress={onOpenFilter}
        style={styles.chip}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing[2],
    paddingHorizontal: layout.screenPaddingH,
  },
  chip: {
    marginRight: 0,
  },
});
