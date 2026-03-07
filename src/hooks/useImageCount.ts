import { useState, useEffect } from 'react';
import { useVisitStore } from '@/stores/useVisitStore';

export const useImageCount = (placeId: string): number => {
  const [count, setCount] = useState(0);
  const { getImageCount } = useVisitStore();

  useEffect(() => {
    getImageCount(placeId).then(setCount);
  }, [placeId, getImageCount]);

  return count;
};
