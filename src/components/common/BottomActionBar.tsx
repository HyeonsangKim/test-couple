import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout, spacing } from '@/theme/tokens';

interface BottomActionBarProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  children,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom + spacing[3];

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: layout.screenPaddingH,
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.line.default,
    backgroundColor: colors.bg.base,
  },
});
