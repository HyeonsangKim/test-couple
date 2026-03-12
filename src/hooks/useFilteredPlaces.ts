import { useMemo } from 'react';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { Place } from '@/types';

export const useFilteredPlaces = (): Place[] => {
  const { places, filter } = usePlaceStore();

  return useMemo(() => {
    let filtered = places.filter((p) => p.status === 'wishlist' || p.status === 'visited');

    // Status filter
    if (filter.status !== 'all') {
      filtered = filtered.filter((p) => p.status === filter.status);
    }

    // Category filter
    if (filter.category.length > 0) {
      filtered = filtered.filter((p) => filter.category.includes(p.category));
    }

    // Search - name only per PRD v2
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Sort by updatedAt desc (default: recent update first)
    filtered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return filtered;
  }, [places, filter]);
};
