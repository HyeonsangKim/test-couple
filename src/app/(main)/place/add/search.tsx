import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, layout, component } from '@/theme/tokens';
import { IconButton } from '@/components/ui';
import { SearchBar } from '@/components/filter/SearchBar';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useMapStore } from '@/stores/useMapStore';
import { useAuthStore } from '@/stores/useAuthStore';
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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MapApiResult[]>([]);
  const [searched, setSearched] = useState(false);

  const { addPlace, checkDuplicate } = usePlaceStore();
  const map = useMapStore((s) => s.map);
  const currentUser = useAuthStore((s) => s.currentUser);

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

  const handleSelectResult = async (result: MapApiResult) => {
    if (!map || !currentUser) return;

    try {
      const duplicate = await checkDuplicate(map.mapId, result.externalPlaceId);
      if (duplicate) {
        Alert.alert('중복 장소', `"${result.name}"은 이미 등록된 장소입니다.`, [
          { text: '확인' },
          {
            text: '장소 보기',
            onPress: () => router.push(`/(main)/place/${duplicate.placeId}`),
          },
        ]);
        return;
      }

      const place = await addPlace({
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        addressText: result.addressText,
        mapId: map.mapId,
        createdByUserId: currentUser.userId,
        sourceType: 'official',
        externalPlaceId: result.externalPlaceId,
        category: result.category,
      });

      Alert.alert('추가 완료', `"${result.name}"이 저장되었습니다.`, [
        { text: '확인', onPress: () => router.back() },
        {
          text: '장소 보기',
          onPress: () => {
            router.back();
            router.push(`/(main)/place/${place.placeId}`);
          },
        },
      ]);
    } catch {
      Alert.alert('오류', '장소 추가에 실패했습니다.');
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
          backgroundColor={colors.bg.elevated}
          color={colors.text.primary}
        />
        <Text style={styles.headerTitle}>장소 검색</Text>
        <View style={{ width: 40 }} />
      </View>

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
              <Text style={styles.emptyDesc}>이름으로 장소를 찾아 추가할 수 있어요</Text>
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
    gap: 16,
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
