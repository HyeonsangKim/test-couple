import React from 'react';
import {
  Modal,
  ModalProps,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius } from '@/theme/tokens';

interface SheetModalShellProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: ModalProps['animationType'];
  sheetStyle?: StyleProp<ViewStyle>;
}

export const SheetModalShell: React.FC<SheetModalShellProps> = ({
  visible,
  onClose,
  children,
  animationType = 'slide',
  sheetStyle,
}) => (
  <Modal visible={visible} transparent animationType={animationType}>
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
      <TouchableOpacity activeOpacity={1} style={[styles.sheet, sheetStyle]}>
        <View>{children}</View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bg.base,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
  },
});
