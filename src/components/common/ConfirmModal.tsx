import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, component } from '@/theme/tokens';
import { Button } from '@/components/ui';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  danger = false,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onCancel}>
      <TouchableOpacity activeOpacity={1} style={styles.modal}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <Button title={cancelLabel} onPress={onCancel} variant="ghost" size="md" style={styles.actionBtn} />
          <Button
            title={confirmLabel}
            onPress={onConfirm}
            variant={danger ? 'fill-danger' : 'fill-primary'}
            size="md"
            style={styles.actionBtn}
          />
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay.dim,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: component.modal.horizontalMargin,
  },
  modal: {
    backgroundColor: colors.bg.elevated,
    borderRadius: component.modal.radius,
    padding: component.modal.padding,
    width: '100%',
    maxWidth: component.modal.maxWidth,
  },
  title: {
    ...typography.title.l,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  message: {
    ...typography.body.m,
    color: colors.text.secondary,
    marginBottom: spacing[6],
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2],
  },
  actionBtn: {
    minWidth: 80,
  },
});
