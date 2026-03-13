import { PlaceAddStatus } from '@/types';

export const shouldShowVisitDateField = (status: PlaceAddStatus) =>
  status === 'visited';

export const shouldCreateVisitRecord = (
  status: PlaceAddStatus,
  imageUrisCount: number,
) => status === 'visited' || imageUrisCount > 0;

