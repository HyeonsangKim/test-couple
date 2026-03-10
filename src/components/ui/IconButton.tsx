import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadow, glass as glassTokens, component } from '@/theme/tokens';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type IconButtonVariant = 'default' | 'glass';

interface IconButtonProps {
  icon: IoniconsName;
  onPress: () => void;
  /** Overall button size in px (default 48 from component.button.floatingIcon) */
  size?: number;
  /** Icon glyph size in px (default 24) */
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  variant?: IconButtonVariant;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = component.button.floatingIcon,
  iconSize = 24,
  color = colors.text.primary,
  backgroundColor,
  variant = 'default',
  style,
}) => {
  const isGlass = variant === 'glass';

  const bg = backgroundColor ?? (isGlass ? glassTokens.fillStrong : colors.bg.elevated);
  const appliedShadow = isGlass ? shadow.glass : shadow.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        appliedShadow,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
        isGlass && {
          borderWidth: glassTokens.border.width,
          borderColor: glassTokens.border.color,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
