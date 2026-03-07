import { useMemo } from 'react';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { Place } from '@/types';

export const useFilteredPlaces = (): Place[] => {
  const { places, filter } = usePlaceStore();

  return useMemo(() => {
    let filtered = [...places];

    // Status filter
    if (filter.status !== 'all') {
      filtered = filtered.filter((p) => p.status === filter.status);
    }

    // Category filter
    if (filter.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filter.category);
    }

    // Search
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      if (filter.searchScope === 'name') {
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
      } else {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
        );
      }
    }

    // Sort by updatedAt desc
    filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return filtered;
  }, [places, filter]);
};
