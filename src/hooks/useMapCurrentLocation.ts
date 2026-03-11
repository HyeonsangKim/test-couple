import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import MapView, { LatLng, Region, UserLocationChangeEvent } from 'react-native-maps';
import { DEFAULT_MAP_REGION } from '@/constants';

const LAST_KNOWN_MAX_AGE_MS = 1000 * 60 * 10;
const LAST_KNOWN_REQUIRED_ACCURACY_METERS = 300;
const DEFAULT_ANIMATION_DURATION = 300;

interface CenterToUserOptions {
  mapRef: React.RefObject<MapView | null>;
  currentRegion?: Region | null;
  animationDuration?: number;
}

const buildTargetRegion = (coordinate: LatLng, currentRegion?: Region | null): Region => ({
  latitude: coordinate.latitude,
  longitude: coordinate.longitude,
  latitudeDelta: currentRegion?.latitudeDelta ?? (DEFAULT_MAP_REGION as Region).latitudeDelta,
  longitudeDelta: currentRegion?.longitudeDelta ?? (DEFAULT_MAP_REGION as Region).longitudeDelta,
});

export const useMapCurrentLocation = () => {
  const cachedCoordinateRef = useRef<LatLng | null>(null);
  const [hasForegroundPermission, setHasForegroundPermission] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const syncPermissionStatus = useCallback(async () => {
    try {
      const permission = await Location.getForegroundPermissionsAsync();
      setHasForegroundPermission(permission.granted);
    } catch {
      setHasForegroundPermission(false);
    }
  }, []);

  useEffect(() => {
    void syncPermissionStatus();
  }, [syncPermissionStatus]);

  const openSettingsAlert = useCallback(() => {
    Alert.alert(
      '위치 권한 필요',
      '현재 위치를 지도에서 표시하려면 설정에서 위치 권한을 허용해주세요.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '설정 열기',
          onPress: () => {
            void Linking.openSettings();
          },
        },
      ],
    );
  }, []);

  const ensureForegroundPermission = useCallback(async () => {
    const currentPermission = await Location.getForegroundPermissionsAsync();

    if (currentPermission.granted) {
      setHasForegroundPermission(true);
      return true;
    }

    if (!currentPermission.canAskAgain) {
      setHasForegroundPermission(false);
      openSettingsAlert();
      return false;
    }

    const requestedPermission = await Location.requestForegroundPermissionsAsync();
    setHasForegroundPermission(requestedPermission.granted);

    if (requestedPermission.granted) {
      return true;
    }

    if (!requestedPermission.canAskAgain) {
      openSettingsAlert();
      return false;
    }

    Alert.alert('위치 권한 필요', '현재 위치를 사용하려면 위치 접근 권한을 허용해주세요.');
    return false;
  }, [openSettingsAlert]);

  const handleUserLocationChange = useCallback((event: UserLocationChangeEvent) => {
    const coordinate = event.nativeEvent.coordinate;

    if (!coordinate) {
      return;
    }

    cachedCoordinateRef.current = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    };
    setHasForegroundPermission(true);
  }, []);

  const getBestAvailableCoordinate = useCallback(async (): Promise<LatLng> => {
    if (cachedCoordinateRef.current) {
      return cachedCoordinateRef.current;
    }

    // Prefer cached location so repeated taps do not wait on a fresh GPS lock.
    const lastKnownPosition = await Location.getLastKnownPositionAsync({
      maxAge: LAST_KNOWN_MAX_AGE_MS,
      requiredAccuracy: LAST_KNOWN_REQUIRED_ACCURACY_METERS,
    });

    if (lastKnownPosition?.coords) {
      return {
        latitude: lastKnownPosition.coords.latitude,
        longitude: lastKnownPosition.coords.longitude,
      };
    }

    const currentPosition = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
    };
  }, []);

  const centerToUser = useCallback(async ({
    mapRef,
    currentRegion,
    animationDuration = DEFAULT_ANIMATION_DURATION,
  }: CenterToUserOptions) => {
    if (!mapRef.current || isLocating) {
      return false;
    }

    setIsLocating(true);

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        Alert.alert('위치 서비스 꺼짐', '기기의 위치 서비스를 켜야 현재 위치로 이동할 수 있어요.');
        return false;
      }

      const hasPermission = await ensureForegroundPermission();

      if (!hasPermission) {
        return false;
      }

      const coordinate = await getBestAvailableCoordinate();
      cachedCoordinateRef.current = coordinate;

      mapRef.current.animateToRegion(buildTargetRegion(coordinate, currentRegion), animationDuration);
      return true;
    } catch {
      Alert.alert('오류', '현재 위치를 가져오지 못했어요. 잠시 후 다시 시도해주세요.');
      return false;
    } finally {
      setIsLocating(false);
    }
  }, [ensureForegroundPermission, getBestAvailableCoordinate, isLocating]);

  return {
    centerToUser,
    handleUserLocationChange,
    hasForegroundPermission,
    isLocating,
    refreshPermissionStatus: syncPermissionStatus,
  };
};
