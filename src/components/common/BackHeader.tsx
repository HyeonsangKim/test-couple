import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, component, layout, spacing, typography } from '@/theme/tokens';
import { IconButton } from '@/components/ui';

type HeaderIconName = React.ComponentProps<typeof Ionicons>['name'];

interface BackHeaderProps {
  title: string;
  onBack: () => void;
  backIcon?: HeaderIconName;
  rightSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bordered?: boolean;
}

export const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  onBack,
  backIcon = 'chevron-back',
  rightSlot,
  style,
  bordered = false,
}) => (
  <View style={[styles.header, bordered ? styles.headerBordered : null, style]}>
    <IconButton
      icon={backIcon}
      onPress={onBack}
      size={component.header.iconButton}
      backgroundColor={colors.bg.elevated}
      color={colors.text.primary}
    />
    <Text numberOfLines={1} style={styles.title}>
      {title}
    </Text>
    <View style={styles.rightSlot}>{rightSlot ?? null}</View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
    backgroundColor: colors.bg.elevated,
  },
  headerBordered: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.soft,
  },
  title: {
    ...typography.title.l,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing[3],
  },
  rightSlot: {
    width: component.header.iconButton,
  },
});
