import React, { useMemo } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, layout } from '@/theme/tokens';
import { Place, MapApiResult, PlaceCategory } from '@/types';
import { CATEGORIES } from '@/constants';

interface MapSearchResultsSheetProps {
  visible: boolean;
  onClose: () => void;
  savedPlaces: Place[];
  externalResults: MapApiResult[];
  searchQuery: string;
  onPlacePress: (placeId: string) => void;
  onExternalPress: (result: MapApiResult) => void;
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const getCategoryIcon = (category: PlaceCategory): IoniconsName => {
  const found = CATEGORIES.find((c) => c.key === category);
  return found?.icon ?? 'location-outline';
};

const getCategoryColor = (category: PlaceCategory): string => {
  const found = CATEGORIES.find((c) => c.key === category);
  return found?.color ?? colors.category.uncategorized;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MapSearchResultsSheet: React.FC<MapSearchResultsSheetProps> = ({
  visible,
  onClose,
  savedPlaces,
  externalResults,
  searchQuery,
  onPlacePress,
  onExternalPress,
}) => {
  // Filter saved places by searchQuery
  const filteredSaved = useMemo(() => {
    if (!searchQuery.trim()) return savedPlaces;
    const q = searchQuery.toLowerCase();
    return savedPlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.addressText?.toLowerCase().includes(q)
    );
  }, [savedPlaces, searchQuery]);

  // Deduplicate external results: exclude ones whose externalPlaceId is already saved
  const savedExternalIds = useMemo(() => {
    const ids = new Set<string>();
    savedPlaces.forEach((p) => {
      if (p.externalPlaceId) {
        ids.add(p.externalPlaceId);
      }
    });
    return ids;
  }, [savedPlaces]);

  const deduplicatedExternal = useMemo(
    () => externalResults.filter((r) => !savedExternalIds.has(r.externalPlaceId)),
    [externalResults, savedExternalIds]
  );

  const sections = useMemo(() => {
    const items: Array<
      | { type: 'section-header'; title: string; key: string }
      | { type: 'saved'; place: Place; key: string }
      | { type: 'external'; result: MapApiResult; key: string }
      | { type: 'empty'; message: string; key: string }
    > = [];

    // Saved places section
    items.push({ type: 'section-header', title: '저장된 장소', key: 'header-saved' });
    if (filteredSaved.length > 0) {
      filteredSaved.forEach((p) =>
        items.push({ type: 'saved', place: p, key: `saved-${p.placeId}` })
      );
    } else {
      items.push({
        type: 'empty',
        message: searchQuery.trim()
          ? '검색 결과가 없습니다'
          : '저장된 장소가 없습니다',
        key: 'empty-saved',
      });
    }

    // External results section
    items.push({
      type: 'section-header',
      title: '이 지역의 다른 장소',
      key: 'header-external',
    });
    if (deduplicatedExternal.length > 0) {
      deduplicatedExternal.forEach((r) =>
        items.push({ type: 'external', result: r, key: `ext-${r.externalPlaceId}` })
      );
    } else {
      items.push({
        type: 'empty',
        message: '검색 결과가 없습니다',
        key: 'empty-external',
      });
    }

    return items;
  }, [filteredSaved, deduplicatedExternal, searchQuery]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>검색 결과</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* List */}
          <FlatList
            data={sections}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              if (item.type === 'section-header') {
                return (
                  <Text style={styles.sectionTitle}>{item.title}</Text>
                );
              }

              if (item.type === 'empty') {
                return (
                  <View style={styles.emptyRow}>
                    <Ionicons
                      name="search-outline"
                      size={18}
                      color={colors.text.tertiary}
                    />
                    <Text style={styles.emptyText}>{item.message}</Text>
                  </View>
                );
              }

              if (item.type === 'saved') {
                const { place } = item;
                return (
                  <TouchableOpacity
                    style={styles.resultItem}
                    activeOpacity={0.7}
                    onPress={() => onPlacePress(place.placeId)}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: getCategoryColor(place.category) + '18' },
                      ]}
                    >
                      <Ionicons
                        name={getCategoryIcon(place.category)}
                        size={18}
                        color={getCategoryColor(place.category)}
                      />
                    </View>
                    <View style={styles.textWrap}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {place.name}
                      </Text>
                      {place.addressText && (
                        <Text style={styles.itemAddress} numberOfLines={1}>
                          {place.addressText}
                        </Text>
                      )}
                    </View>
                    <Ionicons
                      name="bookmark"
                      size={16}
                      color={colors.text.tertiary}
                    />
                  </TouchableOpacity>
                );
              }

              if (item.type === 'external') {
                const { result } = item;
                return (
                  <TouchableOpacity
                    style={styles.resultItem}
                    activeOpacity={0.7}
                    onPress={() => onExternalPress(result)}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        { backgroundColor: getCategoryColor(result.category) + '18' },
                      ]}
                    >
                      <Ionicons
                        name={getCategoryIcon(result.category)}
                        size={18}
                        color={getCategoryColor(result.category)}
                      />
                    </View>
                    <View style={styles.textWrap}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {result.name}
                      </Text>
                      {result.addressText && (
                        <Text style={styles.itemAddress} numberOfLines={1}>
                          {result.addressText}
                        </Text>
                      )}
                    </View>
                    <Ionicons
                      name="add-circle-outline"
                      size={18}
                      color={colors.accent.primary}
                    />
                  </TouchableOpacity>
                );
              }

              return null;
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface.primary,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: SCREEN_HEIGHT * 0.65,
    paddingBottom: spacing[8],
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.strong,
    alignSelf: 'center',
    marginTop: spacing[2],
    marginBottom: spacing[2],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
  },
  headerTitle: {
    ...typography.title.l,
    color: colors.text.primary,
  },
  closeBtn: {
    padding: spacing[1],
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[6],
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.secondary,
    borderRadius: radius.md,
    padding: spacing[3],
    marginBottom: spacing[2],
    gap: spacing[3],
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  itemName: {
    ...typography.title.m,
    color: colors.text.primary,
  },
  itemAddress: {
    ...typography.body.s,
    color: colors.text.secondary,
    marginTop: 2,
  },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[5],
    gap: spacing[2],
  },
  emptyText: {
    ...typography.body.m,
    color: colors.text.tertiary,
  },
});
