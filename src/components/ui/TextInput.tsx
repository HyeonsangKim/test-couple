import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet, TextInputProps as RNTextInputProps, ViewStyle } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme/tokens';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string | null;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  containerStyle,
  rightElement,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        {
          borderColor: error
            ? colors.accent.danger
            : focused
              ? colors.accent.primary
              : colors.border.soft,
        },
      ]}>
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.text.tertiary}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          {...props}
        />
        {rightElement}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing[1],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.surface.primary,
    paddingHorizontal: spacing[4],
  },
  input: {
    flex: 1,
    ...typography.body.m,
    color: colors.text.primary,
    paddingVertical: spacing[3],
  },
  error: {
    ...typography.caption,
    color: colors.accent.danger,
    marginTop: spacing[1],
  },
});
