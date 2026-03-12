import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

export interface DraftPhotoAsset {
  uri: string;
  fileName: string | null;
  latitude: number | null;
  longitude: number | null;
}

const parseNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const parseDmsArray = (value: unknown) => {
  if (!Array.isArray(value) || value.length < 3) {
    return null;
  }

  const degrees = parseNumber(value[0]);
  const minutes = parseNumber(value[1]);
  const seconds = parseNumber(value[2]);

  if (degrees === null || minutes === null || seconds === null) {
    return null;
  }

  return degrees + minutes / 60 + seconds / 3600;
};

const parseExifCoordinate = (
  exif: Record<string, any> | null | undefined,
  keys: string[],
  refKeys: string[],
) => {
  if (!exif) {
    return null;
  }

  for (const key of keys) {
    const raw = exif[key];
    const parsed = parseNumber(raw) ?? parseDmsArray(raw);

    if (parsed === null) {
      continue;
    }

    const refValue = refKeys
      .map((refKey) => exif[refKey])
      .find((value) => typeof value === 'string');
    const normalizedRef = typeof refValue === 'string' ? refValue.toUpperCase() : null;

    if (normalizedRef === 'S' || normalizedRef === 'W') {
      return -Math.abs(parsed);
    }

    return parsed;
  }

  return null;
};

export const serializePickedAsset = (asset: ImagePicker.ImagePickerAsset): DraftPhotoAsset => ({
  uri: asset.uri,
  fileName: asset.fileName ?? null,
  latitude: parseExifCoordinate(
    asset.exif,
    ['GPSLatitude', 'latitude', 'Latitude', 'lat'],
    ['GPSLatitudeRef', 'latitudeRef', 'LatitudeRef'],
  ),
  longitude: parseExifCoordinate(
    asset.exif,
    ['GPSLongitude', 'longitude', 'Longitude', 'lng', 'lon'],
    ['GPSLongitudeRef', 'longitudeRef', 'LongitudeRef'],
  ),
});

const normalizeFileName = (fileName: string | null | undefined) => {
  if (!fileName) {
    return '';
  }

  const withoutExtension = fileName.replace(/\.[^.]+$/, '').trim();

  if (!withoutExtension) {
    return '';
  }

  if (/^(img|image|dsc|pxl|kakaotalk|photo)[-_ ]?\d+$/i.test(withoutExtension)) {
    return '';
  }

  return withoutExtension.replace(/[_-]+/g, ' ').trim();
};

export const getDraftPhotoNameFallback = (draft: DraftPhotoAsset | null | undefined) =>
  normalizeFileName(draft?.fileName);

export const buildAddressText = (address: Location.LocationGeocodedAddress | null | undefined) => {
  if (!address) {
    return '';
  }

  return [
    address.region,
    address.city,
    address.district,
    address.street,
    address.streetNumber,
  ]
    .filter((part, index, parts) => !!part && parts.indexOf(part) === index)
    .join(' ');
};

export const buildSuggestedPlaceName = (
  address: Location.LocationGeocodedAddress | null | undefined,
  fallbackName?: string,
) => {
  const candidates = [
    address?.name,
    address?.street,
    address?.district,
    address?.subregion,
    address?.city,
    fallbackName,
  ];

  return candidates.find((value) => typeof value === 'string' && value.trim())?.trim() ?? '';
};
