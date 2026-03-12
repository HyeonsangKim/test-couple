import React, { useEffect, useRef } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/theme/tokens';
import { LIMITS } from '@/constants';
import { serializePickedAsset } from '@/utils/photoMetadata';

export default function PlaceAddPhotoRedirectScreen() {
  const router = useRouter();
  const didLaunchRef = useRef(false);

  useEffect(() => {
    if (didLaunchRef.current) {
      return;
    }

    didLaunchRef.current = true;

    const launchPicker = async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          quality: 0.8,
          exif: true,
          selectionLimit: LIMITS.MAX_IMAGES_PER_PLACE,
        });

        if (result.canceled) {
          router.back();
          return;
        }

        const draftImages = result.assets.map(serializePickedAsset);
        const imageUris = draftImages.map((image) => image.uri);

        router.replace({
          pathname: '/(main)/place/add/photo/create',
          params: {
            imageUris: JSON.stringify(imageUris),
            imageDrafts: JSON.stringify(draftImages),
          },
        });
      } catch {
        Alert.alert('오류', '사진을 선택할 수 없습니다.', [
          { text: '확인', onPress: () => router.back() },
        ]);
      }
    };

    void launchPicker();
  }, [router]);

  return <SafeAreaView style={styles.safe} />;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
});
