import { format } from 'date-fns';
import { Place, PlaceAddDraft } from '@/types';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMapStore } from '@/stores/useMapStore';
import { usePlaceStore } from '@/stores/usePlaceStore';
import { useVisitStore } from '@/stores/useVisitStore';
import { shouldCreateVisitRecord } from '@/utils/placeAddRules';
import { validatePlaceName } from '@/utils/validation';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getTodayVisitDate = () => format(new Date(), 'yyyy-MM-dd');

const normalizeVisitDate = (visitDate?: string) =>
  visitDate && DATE_PATTERN.test(visitDate) ? visitDate : getTodayVisitDate();

const dedupeImageUris = (imageUris: string[]) =>
  Array.from(
    new Set(
      imageUris
        .map((uri) => uri.trim())
        .filter((uri) => uri.length > 0),
    ),
  );

export const createPlaceFromDraft = async (draft: PlaceAddDraft): Promise<Place> => {
  const map = useMapStore.getState().map;
  const currentUser = useAuthStore.getState().currentUser;

  if (!map || !currentUser) {
    throw new Error('저장에 필요한 사용자/지도 정보를 불러오지 못했습니다.');
  }

  const normalizedName = draft.name.trim();
  const nameError = validatePlaceName(normalizedName);
  if (nameError) {
    throw new Error(nameError);
  }

  const imageUris = dedupeImageUris(draft.imageUris);
  const shouldCreateVisit = shouldCreateVisitRecord(draft.status, imageUris.length);
  const visitDate = shouldCreateVisit ? normalizeVisitDate(draft.visitDate) : null;

  const addPlace = usePlaceStore.getState().addPlace;
  const updatePlace = usePlaceStore.getState().updatePlace;
  const addVisit = useVisitStore.getState().addVisit;
  const addImages = useVisitStore.getState().addImages;

  const place = await addPlace({
    name: normalizedName,
    latitude: draft.coordinate.latitude,
    longitude: draft.coordinate.longitude,
    addressText: draft.addressText ?? null,
    mapId: map.mapId,
    createdByUserId: currentUser.userId,
    sourceType: draft.sourceType,
    externalPlaceId: draft.externalPlaceId ?? null,
    category: draft.category,
    categoryManual: true,
    status: draft.status,
  });

  let heroImageId: string | null = null;

  if (shouldCreateVisit && visitDate) {
    const visit = await addVisit({
      placeId: place.placeId,
      visitDate,
      createdByUserId: currentUser.userId,
    });

    if (imageUris.length > 0) {
      const createdImages = await addImages(
        imageUris.map((uri) => ({
          visitId: visit.visitId,
          uri,
        })),
      );
      heroImageId = createdImages[0]?.imageId ?? null;
    }
  }

  if (!heroImageId) {
    return place;
  }

  await updatePlace(place.placeId, { heroImageId });
  return { ...place, heroImageId };
};
