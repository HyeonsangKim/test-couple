import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { IconButton } from '@/components/ui';
import { colors, component, layout, spacing, typography } from '@/theme/tokens';

interface AppHeaderProps {
  title: string;
  onBack: () => void;
  rightSlot?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showBottomBorder?: boolean;
}

export function AppHeader({
  title,
  onBack,
  rightSlot,
  style,
  showBottomBorder = true,
}: AppHeaderProps) {
  return (
    <View style={[styles.header, showBottomBorder && styles.headerBorder, style]}>
      <IconButton
        icon="chevron-back"
        onPress={onBack}
        size={component.header.iconButton}
        backgroundColor={colors.bg.elevated}
        color={colors.text.primary}
      />
      <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSide}>
        {rightSlot ?? <View style={styles.headerSideSpacer} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
    backgroundColor: colors.bg.elevated,
  },
  headerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border.soft,
  },
  headerTitle: {
    ...typography.title.l,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing[3],
  },
  headerSide: {
    width: component.header.iconButton,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerSideSpacer: {
    width: component.header.iconButton,
    height: component.header.iconButton,
  },
});
