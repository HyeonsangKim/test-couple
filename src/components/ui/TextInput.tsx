import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';
import { colors, typography, spacing, shadow, component } from '@/theme/tokens';

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
      <View
        style={[
          styles.inputContainer,
          focused && shadow.sm,
          error && styles.inputContainerError,
        ]}
      >
        <RNTextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.text.tertiary}
          selectionColor={colors.accent.primary}
          showSoftInputOnFocus
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
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
    marginBottom: spacing[2], // 8px gap
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: component.input.radius,
    backgroundColor: colors.bg.soft,
    height: component.input.height,
    paddingHorizontal: component.input.horizontalPadding,
  },
  inputContainerError: {
    borderColor: colors.accent.danger,
  },
  input: {
    flex: 1,
    ...typography.body.m,
    color: colors.text.primary,
    paddingVertical: 0, // let height dictate vertical centering
  },
  error: {
    ...typography.caption,
    color: colors.accent.danger,
    marginTop: spacing[1],
  },
});
