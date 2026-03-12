import { useEffect, useMemo, useState } from "react";
import { visitService } from "@/services/visitService";
import { Place } from "@/types";
import { useFilteredPlaces } from "./useFilteredPlaces";

type ThumbnailStatus = "ready" | "pending" | "missing";

export interface FilteredPlaceListItem {
  place: Place;
  thumbnailUri: string | null;
  thumbnailStatus: ThumbnailStatus;
}

export const useFilteredPlaceListItems = (): FilteredPlaceListItem[] => {
  const filteredPlaces = useFilteredPlaces();
  const [thumbnailUriByImageId, setThumbnailUriByImageId] = useState<
    Record<string, string | null>
  >({});
  const [fallbackThumbnailUriByPlaceId, setFallbackThumbnailUriByPlaceId] =
    useState<Record<string, string | null>>({});

  const heroImageIds = useMemo(
    () =>
      Array.from(
        new Set(
          filteredPlaces
            .map((place) => place.heroImageId)
            .filter((imageId): imageId is string => Boolean(imageId)),
        ),
      ),
    [filteredPlaces],
  );

  const missingHeroImageIds = useMemo(
    () =>
      heroImageIds.filter(
        (imageId) => thumbnailUriByImageId[imageId] === undefined,
      ),
    [heroImageIds, thumbnailUriByImageId],
  );

  const placeIdsNeedingFallbackThumbnail = useMemo(
    () =>
      filteredPlaces
        .filter((place) => {
          if (place.status === "wishlist") return false;

          if (!place.heroImageId) {
            return fallbackThumbnailUriByPlaceId[place.placeId] === undefined;
          }

          const heroThumbnail = thumbnailUriByImageId[place.heroImageId];
          return (
            heroThumbnail === null &&
            fallbackThumbnailUriByPlaceId[place.placeId] === undefined
          );
        })
        .map((place) => place.placeId),
    [fallbackThumbnailUriByPlaceId, filteredPlaces, thumbnailUriByImageId],
  );

  useEffect(() => {
    if (missingHeroImageIds.length === 0) return;

    let canceled = false;

    const resolveThumbnails = async () => {
      try {
        const uriMap =
          await visitService.getImageUriMapByIds(missingHeroImageIds);
        if (canceled) return;

        const resolvedById: Record<string, string | null> = {};
        for (const imageId of missingHeroImageIds) {
          resolvedById[imageId] = uriMap[imageId] ?? null;
        }

        setThumbnailUriByImageId((prev) => ({ ...prev, ...resolvedById }));
      } catch {
        if (canceled) return;

        const failedById: Record<string, null> = {};
        for (const imageId of missingHeroImageIds) {
          failedById[imageId] = null;
        }

        setThumbnailUriByImageId((prev) => ({ ...prev, ...failedById }));
      }
    };

    resolveThumbnails();

    return () => {
      canceled = true;
    };
  }, [missingHeroImageIds]);

  useEffect(() => {
    if (placeIdsNeedingFallbackThumbnail.length === 0) return;

    let canceled = false;

    const resolveFallbackThumbnails = async () => {
      try {
        const uriMap = await visitService.getLatestImageUriByPlaceIds(
          placeIdsNeedingFallbackThumbnail,
        );
        if (canceled) return;

        const resolvedByPlaceId: Record<string, string | null> = {};
        for (const placeId of placeIdsNeedingFallbackThumbnail) {
          resolvedByPlaceId[placeId] = uriMap[placeId] ?? null;
        }

        setFallbackThumbnailUriByPlaceId((prev) => ({
          ...prev,
          ...resolvedByPlaceId,
        }));
      } catch {
        if (canceled) return;

        const failedByPlaceId: Record<string, null> = {};
        for (const placeId of placeIdsNeedingFallbackThumbnail) {
          failedByPlaceId[placeId] = null;
        }

        setFallbackThumbnailUriByPlaceId((prev) => ({
          ...prev,
          ...failedByPlaceId,
        }));
      }
    };

    resolveFallbackThumbnails();

    return () => {
      canceled = true;
    };
  }, [placeIdsNeedingFallbackThumbnail]);

  return useMemo(
    () =>
      filteredPlaces.map((place) => {
        if (!place.heroImageId) {
          const fallbackThumbnail =
            fallbackThumbnailUriByPlaceId[place.placeId];
          if (fallbackThumbnail === undefined && place.status !== "wishlist") {
            return {
              place,
              thumbnailUri: null,
              thumbnailStatus: "pending" as const,
            };
          }
          return {
            place,
            thumbnailUri: fallbackThumbnail ?? null,
            thumbnailStatus: fallbackThumbnail
              ? ("ready" as const)
              : ("missing" as const),
          };
        }

        const resolvedThumbnail = thumbnailUriByImageId[place.heroImageId];

        if (resolvedThumbnail === undefined) {
          return {
            place,
            thumbnailUri: null,
            thumbnailStatus: "pending" as const,
          };
        }

        return {
          place,
          thumbnailUri:
            resolvedThumbnail ??
            fallbackThumbnailUriByPlaceId[place.placeId] ??
            null,
          thumbnailStatus:
            resolvedThumbnail || fallbackThumbnailUriByPlaceId[place.placeId]
              ? ("ready" as const)
              : fallbackThumbnailUriByPlaceId[place.placeId] === undefined &&
                  place.status !== "wishlist"
                ? ("pending" as const)
                : ("missing" as const),
        };
      }),
    [fallbackThumbnailUriByPlaceId, filteredPlaces, thumbnailUriByImageId],
  );
};
