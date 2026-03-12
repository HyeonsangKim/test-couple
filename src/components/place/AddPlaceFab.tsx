import React from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radius, shadow, layout, component } from '@/theme/tokens';
import { LIMITS } from '@/constants';
import { serializePickedAsset } from '@/utils/photoMetadata';

interface AddPlaceFabProps {
  visible: boolean;
  bottom: number;
  onVisibleChange: (visible: boolean) => void;
  onBeforeOpen?: () => void;
}

export const AddPlaceFab: React.FC<AddPlaceFabProps> = ({
  visible,
  bottom,
  onVisibleChange,
  onBeforeOpen,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleAddBySearch = () => {
    onVisibleChange(false);
    router.push('/(main)/place/add/search');
  };

  const handleAddByPin = () => {
    onVisibleChange(false);
    router.push('/(main)/place/add/pin');
  };

  const handleAddByPhoto = () => {
    onVisibleChange(false);
    setTimeout(async () => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          quality: 0.8,
          exif: true,
          selectionLimit: LIMITS.MAX_IMAGES_PER_PLACE,
        });

        if (result.canceled) {
          return;
        }

        const draftImages = result.assets.map(serializePickedAsset);
        const imageUris = draftImages.map((image) => image.uri);

        router.push({
          pathname: '/(main)/place/add/photo/create',
          params: {
            imageUris: JSON.stringify(imageUris),
            imageDrafts: JSON.stringify(draftImages),
          },
        });
      } catch {
        Alert.alert('오류', '사진을 선택할 수 없습니다.');
      }
    }, 180);
  };

  const handleOpenAddMenu = () => {
    onBeforeOpen?.();
    onVisibleChange(true);
  };

  const addMenuOptions = [
    {
      key: 'search',
      icon: 'search' as const,
      title: '검색으로 추가',
      description: '장소 이름이나 검색 결과를 선택해 바로 저장',
      onPress: handleAddBySearch,
    },
    {
      key: 'pin',
      icon: 'pin-outline' as const,
      title: '지도에 핀 찍기',
      description: '원하는 위치를 직접 지정해서 커스텀 장소 만들기',
      onPress: handleAddByPin,
    },
    {
      key: 'photo',
      icon: 'camera-outline' as const,
      title: '사진으로 추가',
      description: '사진과 함께 방문 기록을 남기며 장소 추가',
      onPress: handleAddByPhoto,
    },
  ];

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { bottom }]}
        onPress={handleOpenAddMenu}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={colors.text.inverse} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => onVisibleChange(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.addMenu, { paddingBottom: Math.max(insets.bottom, spacing[6]) }]}
          >
            <View style={styles.handleBar} />

            <View style={styles.addMenuHeader}>
              <Text style={styles.addMenuTitle}>장소 추가</Text>
            </View>

            <Text style={styles.addMenuSectionLabel}>추가 방식</Text>
            <View style={styles.addMenuList}>
              {addMenuOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={styles.addMenuItem}
                  onPress={option.onPress}
                  activeOpacity={0.8}
                >
                  <View style={styles.addMenuIconFrame}>
                    <Ionicons name={option.icon} size={18} color={colors.text.secondary} />
                  </View>
                  <View style={styles.addMenuTextBlock}>
                    <Text style={styles.addMenuLabel}>{option.title}</Text>
                    <Text style={styles.addMenuDesc}>{option.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.text.tertiary} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.addMenuDismiss}
              onPress={() => onVisibleChange(false)}
              activeOpacity={0.75}
            >
              <Text style={styles.addMenuDismissText}>닫기</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: layout.screenPaddingH,
    width: component.button.fab,
    height: component.button.fab,
    borderRadius: component.button.fab / 2,
    backgroundColor: colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
    ...shadow.lg,
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'flex-end',
  },
  addMenu: {
    backgroundColor: colors.bg.sheet,
    borderTopLeftRadius: component.sheet.topRadius,
    borderTopRightRadius: component.sheet.topRadius,
    paddingHorizontal: component.sheet.innerHorizontalPadding,
    paddingTop: component.sheet.topPadding,
  },
  handleBar: {
    width: component.sheet.handleWidth,
    height: component.sheet.handleHeight,
    borderRadius: component.sheet.handleHeight / 2,
    backgroundColor: colors.line.strong,
    alignSelf: 'center',
    marginBottom: spacing[3],
  },
  addMenuHeader: {
    marginBottom: spacing[5],
  },
  addMenuTitle: {
    ...typography.title.l,
    color: colors.text.primary,
  },
  addMenuSectionLabel: {
    ...typography.body.m,
    color: colors.text.tertiary,
    marginBottom: spacing[3],
  },
  addMenuList: {
    gap: spacing[3],
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: component.settingsRow.heightComfortable,
    backgroundColor: colors.bg.subtle,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  addMenuIconFrame: {
    width: component.settingsRow.iconFrame,
    height: component.settingsRow.iconFrame,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMenuTextBlock: {
    flex: 1,
    gap: spacing[1],
  },
  addMenuLabel: {
    ...typography.body.l,
    color: colors.text.primary,
  },
  addMenuDesc: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
  addMenuDismiss: {
    marginTop: spacing[5],
    minHeight: component.settingsRow.height,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.bg.subtle,
  },
  addMenuDismissText: {
    ...typography.body.l,
    color: colors.text.secondary,
  },
});
