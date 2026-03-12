import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LIMITS } from '@/constants';
import { colors, radius, spacing, typography } from '@/theme/tokens';

const THUMB_SIZE = 96;

interface PlaceImageUploadFieldProps {
  imageUris: string[];
  onChangeImageUris: (uris: string[]) => void;
  style?: StyleProp<ViewStyle>;
}

export function PlaceImageUploadField({
  imageUris,
  onChangeImageUris,
  style,
}: PlaceImageUploadFieldProps) {
  const [loading, setLoading] = useState(false);

  const mergeImageUris = (currentUris: string[], incomingUris: string[]) => {
    const merged: string[] = [];
    const seen = new Set<string>();

    for (const uri of [...currentUris, ...incomingUris]) {
      const normalized = uri.trim();
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      merged.push(normalized);
      if (merged.length >= LIMITS.MAX_IMAGES_PER_PLACE) {
        break;
      }
    }

    return merged;
  };

  const handlePickImages = async () => {
    const remainingSlots = LIMITS.MAX_IMAGES_PER_PLACE - imageUris.length;
    if (remainingSlots <= 0) {
      Alert.alert('알림', `사진은 최대 ${LIMITS.MAX_IMAGES_PER_PLACE}장까지 업로드할 수 있어요.`);
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (result.canceled) {
        return;
      }

      const nextUris = result.assets
        .map((asset) => asset.uri)
        .filter((uri) => Boolean(uri));

      if (nextUris.length === 0) {
        return;
      }

      onChangeImageUris(mergeImageUris(imageUris, nextUris));
    } catch {
      Alert.alert('오류', '사진을 선택할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const nextUris = imageUris.filter((_, index) => index !== indexToRemove);
    onChangeImageUris(nextUris);
  };

  return (
    <View style={style}>
      <Text style={styles.title}>사진 업로드</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
        {imageUris.length > 0 ? (
          imageUris.map((uri, index) => (
            <View key={`${uri}_${index}`} style={styles.imageThumbWrap}>
              <Image source={{ uri }} style={styles.imageThumb} />
              <Pressable
                onPress={() => handleRemoveImage(index)}
                style={styles.removeButton}
                hitSlop={6}
              >
                <Ionicons name="close" size={14} color={colors.white} />
              </Pressable>
            </View>
          ))
        ) : null}

        <TouchableOpacity
          onPress={handlePickImages}
          activeOpacity={0.7}
          style={styles.uploadTile}
          disabled={loading}
        >
          <Ionicons
            name={imageUris.length > 0 ? 'add' : 'camera-outline'}
            size={24}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.title.l,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  imageRow: {
    flexDirection: 'row',
    marginTop: spacing[2],
  },
  uploadTile: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line.strong,
    backgroundColor: colors.bg.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
    opacity: 1,
  },
  imageThumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.md,
    marginRight: spacing[2],
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.bg.soft,
  },
  imageThumb: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: spacing[1],
    right: spacing[1],
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.56)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
