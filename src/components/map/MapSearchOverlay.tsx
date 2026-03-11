import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '@/components/filter/SearchBar';
import { CATEGORIES } from '@/constants';
import { searchService } from '@/services/searchService';
import { colors, component, layout, radius, shadow, spacing, typography } from '@/theme/tokens';
import { MapApiResult, Place, PlaceCategory } from '@/types';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export interface MapSearchOverlayHandle {
  close: () => void;
  reset: () => void;
}

interface MapSearchOverlayProps {
  savedPlaces: Place[];
  isFilterActive: boolean;
  onOpenFilter: () => void;
  onSavedPlacePress: (placeId: string) => void;
  onExternalPress: (result: MapApiResult) => void;
  suspended?: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const getCategoryIcon = (category: PlaceCategory): IoniconsName => {
  const found = CATEGORIES.find((item) => item.key === category);
  return found?.icon ?? 'location-outline';
};

const getCategoryColor = (category: PlaceCategory): string => {
  const found = CATEGORIES.find((item) => item.key === category);
  return found?.color ?? colors.category.uncategorized;
};

export const MapSearchOverlay = forwardRef<MapSearchOverlayHandle, MapSearchOverlayProps>(({
  savedPlaces,
  isFilterActive,
  onOpenFilter,
  onSavedPlacePress,
  onExternalPress,
  suspended = false,
}, ref) => {
  const inputRef = useRef<TextInput>(null);
  const requestIdRef = useRef(0);
  const [query, setQuery] = useState('');
  const [externalResults, setExternalResults] = useState<MapApiResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => {
    Keyboard.dismiss();
    setIsOpen(false);
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    Keyboard.dismiss();
    setIsOpen(false);
    setQuery('');
    setExternalResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  useImperativeHandle(ref, () => ({
    close,
    reset,
  }), [close, reset]);

  useEffect(() => {
    if (!isOpen || Platform.OS !== 'android') return undefined;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });

    return () => subscription.remove();
  }, [close, isOpen]);

  useEffect(() => {
    if (!suspended) return;
    close();
  }, [close, suspended]);

  const runSearch = useCallback(async (nextQuery: string) => {
    const trimmed = nextQuery.trim();

    if (!trimmed) {
      requestIdRef.current += 1;
      setExternalResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsLoading(true);
    setError(null);

    try {
      const results = await searchService.searchPlaces(trimmed);
      if (requestIdRef.current !== requestId) return;
      setExternalResults(results);
    } catch {
      if (requestIdRef.current !== requestId) return;
      setExternalResults([]);
      setError('네트워크 오류가 발생했어요.');
    } finally {
      if (requestIdRef.current === requestId) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    runSearch(query);
  }, [query, runSearch]);

  const filteredSavedPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return savedPlaces;
    }

    return savedPlaces.filter((place) => (
      place.name.toLowerCase().includes(normalizedQuery) ||
      place.addressText?.toLowerCase().includes(normalizedQuery)
    ));
  }, [query, savedPlaces]);

  const deduplicatedExternalResults = useMemo(() => {
    const savedExternalIds = new Set(
      savedPlaces
        .map((place) => place.externalPlaceId)
        .filter((value): value is string => Boolean(value)),
    );

    return externalResults.filter((result) => !savedExternalIds.has(result.externalPlaceId));
  }, [externalResults, savedPlaces]);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleFilterPress = useCallback(() => {
    close();
    onOpenFilter();
  }, [close, onOpenFilter]);

  const handleClear = useCallback(() => {
    reset();
  }, [reset]);

  const handleSavedPlacePress = useCallback((placeId: string) => {
    reset();
    onSavedPlacePress(placeId);
  }, [onSavedPlacePress, reset]);

  const handleExternalPlacePress = useCallback((result: MapApiResult) => {
    reset();
    onExternalPress(result);
  }, [onExternalPress, reset]);

  const handleRetry = useCallback(() => {
    runSearch(query);
  }, [query, runSearch]);

  const hasQuery = query.trim().length > 0;

  return (
    <View pointerEvents="box-none" style={styles.root}>
      {isOpen ? <Pressable style={styles.backdrop} onPress={close} /> : null}

      <SafeAreaView edges={['top']} pointerEvents="box-none" style={styles.safeArea}>
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <SearchBar
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              onClear={handleClear}
              onFocus={handleFocus}
              placeholder="장소 검색..."
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleFilterPress}
            style={[styles.filterButton, isFilterActive && styles.filterButtonActive]}
          >
            <Ionicons
              name="funnel-outline"
              size={18}
              color={isFilterActive ? colors.text.inverse : colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {isOpen && (
          <View style={styles.panel}>
            <ScrollView
              bounces={false}
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              onScrollBeginDrag={Keyboard.dismiss}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>저장된 장소</Text>
                {filteredSavedPlaces.length > 0 ? (
                  filteredSavedPlaces.map((place, index) => (
                    <TouchableOpacity
                      key={place.placeId}
                      activeOpacity={0.7}
                      onPress={() => handleSavedPlacePress(place.placeId)}
                      style={[styles.resultRow, index > 0 && styles.rowDivider]}
                    >
                      <View style={styles.iconBox}>
                        <Ionicons
                          color={getCategoryColor(place.category)}
                          name={getCategoryIcon(place.category)}
                          size={18}
                        />
                      </View>
                      <View style={styles.resultTextBlock}>
                        <Text numberOfLines={1} style={styles.resultTitle}>{place.name}</Text>
                        {place.addressText ? (
                          <Text numberOfLines={1} style={styles.resultSubtitle}>{place.addressText}</Text>
                        ) : null}
                      </View>
                      <Ionicons name="bookmark" size={16} color={colors.text.tertiary} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.stateRow}>
                    <Ionicons name="search-outline" size={18} color={colors.text.tertiary} />
                    <Text style={styles.stateText}>저장된 장소에서 일치하는 결과가 없어요</Text>
                  </View>
                )}
              </View>

              <View style={[styles.section, styles.sectionDivider]}>
                <Text style={styles.sectionTitle}>외부 장소</Text>
                {!hasQuery ? (
                  <View style={styles.stateRow}>
                    <Ionicons name="search-outline" size={18} color={colors.text.tertiary} />
                    <Text style={styles.stateText}>검색어를 입력하면 외부 장소 결과가 표시돼요</Text>
                  </View>
                ) : isLoading ? (
                  <View>
                    {[0, 1, 2].map((item, index) => (
                      <View
                        key={item}
                        style={[styles.skeletonRow, index > 0 && styles.rowDivider]}
                      >
                        <View style={styles.skeletonIcon} />
                        <View style={styles.skeletonTextBlock}>
                          <View style={styles.skeletonTitle} />
                          <View style={styles.skeletonSubtitle} />
                        </View>
                      </View>
                    ))}
                  </View>
                ) : error ? (
                  <View style={styles.errorBlock}>
                    <View style={styles.stateRow}>
                      <Ionicons name="warning-outline" size={18} color={colors.accent.danger} />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} onPress={handleRetry}>
                      <Text style={styles.retryText}>다시 시도</Text>
                    </TouchableOpacity>
                  </View>
                ) : deduplicatedExternalResults.length > 0 ? (
                  deduplicatedExternalResults.map((result, index) => (
                    <TouchableOpacity
                      key={result.externalPlaceId}
                      activeOpacity={0.7}
                      onPress={() => handleExternalPlacePress(result)}
                      style={[styles.resultRow, index > 0 && styles.rowDivider]}
                    >
                      <View style={styles.iconBox}>
                        <Ionicons
                          color={getCategoryColor(result.category)}
                          name={getCategoryIcon(result.category)}
                          size={18}
                        />
                      </View>
                      <View style={styles.resultTextBlock}>
                        <Text numberOfLines={1} style={styles.resultTitle}>{result.name}</Text>
                        {result.addressText ? (
                          <Text numberOfLines={1} style={styles.resultSubtitle}>{result.addressText}</Text>
                        ) : null}
                      </View>
                      <Ionicons name="add-circle-outline" size={18} color={colors.accent.primary} />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.stateRow}>
                    <Ionicons name="search-outline" size={18} color={colors.text.tertiary} />
                    <Text style={styles.stateText}>검색 결과가 없어요</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
});

MapSearchOverlay.displayName = 'MapSearchOverlay';

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  safeArea: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[2],
  },
  searchBarWrapper: {
    flex: 1,
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: component.searchBar.height,
    height: component.searchBar.height,
    borderRadius: component.searchBar.radius,
    backgroundColor: colors.bg.base,
    borderWidth: 1,
    borderColor: colors.line.default,
  },
  filterButtonActive: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  panel: {
    marginTop: spacing[2],
    marginHorizontal: layout.screenPaddingH,
    maxHeight: SCREEN_HEIGHT * 0.58,
    backgroundColor: colors.bg.sheet,
    borderRadius: radius.sheet,
    borderWidth: 1,
    borderColor: colors.line.default,
    overflow: 'hidden',
    ...shadow.sm,
  },
  section: {
    paddingVertical: spacing[2],
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.line.default,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.text.tertiary,
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[1],
    paddingBottom: spacing[2],
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.line.default,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultTextBlock: {
    flex: 1,
  },
  resultTitle: {
    ...typography.title.m,
    color: colors.text.primary,
  },
  resultSubtitle: {
    ...typography.body.m,
    color: colors.text.secondary,
    marginTop: 2,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[5],
  },
  stateText: {
    ...typography.body.m,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  errorBlock: {
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[5],
  },
  errorText: {
    ...typography.body.m,
    color: colors.accent.danger,
  },
  retryText: {
    ...typography.body.m,
    color: colors.accent.primary,
    marginTop: spacing[2],
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.bg.muted,
  },
  skeletonTextBlock: {
    flex: 1,
    gap: spacing[2],
  },
  skeletonTitle: {
    height: 14,
    width: '55%',
    borderRadius: radius.xs,
    backgroundColor: colors.bg.muted,
  },
  skeletonSubtitle: {
    height: 12,
    width: '80%',
    borderRadius: radius.xs,
    backgroundColor: colors.bg.muted,
  },
});
