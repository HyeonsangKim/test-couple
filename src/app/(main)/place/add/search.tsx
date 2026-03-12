import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, layout, component } from '@/theme/tokens';
import { BackHeader } from '@/components/common/BackHeader';
import { SearchBar } from '@/components/filter/SearchBar';
import { MapApiResult } from '@/types';

// Mock search results
const MOCK_SEARCH_RESULTS: MapApiResult[] = [
  {
    externalPlaceId: 'search_001',
    name: '강남역 스타벅스',
    latitude: 37.4979,
    longitude: 127.0276,
    addressText: '서울 강남구 강남대로 396',
    category: 'food',
  },
  {
    externalPlaceId: 'search_002',
    name: '여의도 한강공원',
    latitude: 37.5284,
    longitude: 126.9326,
    addressText: '서울 영등포구 여의동로 330',
    category: 'travel',
  },
  {
    externalPlaceId: 'search_003',
    name: '코엑스 아쿠아리움',
    latitude: 37.5112,
    longitude: 127.0590,
    addressText: '서울 강남구 영동대로 513',
    category: 'activity',
  },
  {
    externalPlaceId: 'search_004',
    name: '이태원 부기우기',
    latitude: 37.5340,
    longitude: 126.9945,
    addressText: '서울 용산구 이태원로 192',
    category: 'food',
  },
  {
    externalPlaceId: 'search_005',
    name: '북촌 한옥마을',
    latitude: 37.5824,
    longitude: 126.9836,
    addressText: '서울 종로구 계동길 37',
    category: 'travel',
  },
];

export default function PlaceAddSearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    externalPlaceId?: string;
    name?: string;
    latitude?: string;
    longitude?: string;
    addressText?: string;
    category?: string;
  }>();
  const redirectedRef = useRef(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MapApiResult[]>([]);
  const [searched, setSearched] = useState(false);

  // Live search with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timeout = setTimeout(() => {
      setSearched(true);
      const filtered = MOCK_SEARCH_RESULTS.filter(
        (r) => r.name.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filtered.length > 0 ? filtered : MOCK_SEARCH_RESULTS);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (!params.externalPlaceId || redirectedRef.current) {
      return;
    }

    redirectedRef.current = true;
    router.replace({
      pathname: '/(main)/place/add/search-configure',
      params: {
        externalPlaceId: params.externalPlaceId,
        name: params.name ?? '',
        latitude: params.latitude ?? '',
        longitude: params.longitude ?? '',
        addressText: params.addressText ?? '',
        category: params.category ?? 'uncategorized',
      },
    });
  }, [params, router]);

  const handleSelectResult = (result: MapApiResult) => {
    router.push({
      pathname: '/(main)/place/add/search-configure',
      params: {
        externalPlaceId: result.externalPlaceId,
        name: result.name,
        latitude: String(result.latitude),
        longitude: String(result.longitude),
        addressText: result.addressText ?? '',
        category: result.category,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <BackHeader title="장소 검색" onBack={() => router.back()} />

      {/* Search — live search, no button */}
      <View style={styles.searchSection}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="장소 이름으로 검색..."
          onClear={() => {
            setQuery('');
            setResults([]);
            setSearched(false);
          }}
        />
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.externalPlaceId}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultRow}
            onPress={() => handleSelectResult(item)}
            activeOpacity={0.7}
          >
            <View style={styles.resultIconCircle}>
              <Ionicons name="location-outline" size={20} color={colors.accent.primary} />
            </View>
            <View style={styles.resultContent}>
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultAddress}>{item.addressText}</Text>
            </View>
            <Ionicons name="add-circle-outline" size={24} color={colors.accent.primary} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          searched ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={component.emptyState.icon} color={colors.text.tertiary} />
              <Text style={styles.emptyTitle}>검색 결과가 없어요</Text>
              <Text style={styles.emptyDesc}>다른 검색어로 시도해보세요</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={component.emptyState.icon} color={colors.text.tertiary} />
              <Text style={styles.emptyTitle}>장소를 검색해보세요</Text>
              <Text style={styles.emptyDesc}>검색 결과를 선택하면 설정 화면으로 이동해요</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.canvas,
  },
  searchSection: {
    paddingHorizontal: layout.screenPaddingH,
    marginBottom: spacing[4],
  },
  listContent: {
    paddingHorizontal: layout.screenPaddingH,
    paddingBottom: spacing[10],
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.elevated,
    borderRadius: radius.xl,
    paddingVertical: spacing[4],
    paddingHorizontal: component.resultRow.horizontalPadding,
    marginBottom: spacing[2],
    minHeight: component.resultRow.mediaHeight,
    gap: spacing[4],
  },
  resultIconCircle: {
    width: component.resultRow.thumb,
    height: component.resultRow.thumb,
    borderRadius: component.resultRow.thumbRadius,
    backgroundColor: colors.bg.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    ...typography.title.m,
    color: colors.text.primary,
  },
  resultAddress: {
    ...typography.body.s,
    color: colors.text.secondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: component.emptyState.verticalPadding,
    maxWidth: component.emptyState.maxWidth,
    alignSelf: 'center',
  },
  emptyTitle: {
    ...typography.title.m,
    color: colors.text.primary,
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  emptyDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
