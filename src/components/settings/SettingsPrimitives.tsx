import React, { useState } from 'react';
import {
  StyleSheet,
  StyleProp,
  Switch,
  Text,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomActionBar } from '@/components/common/BottomActionBar';
import { colors, component, layout, radius, spacing, typography } from '@/theme/tokens';

interface SettingsHeaderProps {
  title: string;
  onBack: () => void;
  rightSlot?: React.ReactNode;
}

interface SettingsSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface SettingsSurfaceProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  tone?: 'subtle' | 'danger';
}

interface SettingsTextFieldProps extends RNTextInputProps {
  label?: string;
  helperText?: string;
  metaText?: string;
}

interface SettingsSwitchRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function SettingsHeader({ title, onBack, rightSlot }: SettingsHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.headerButton}>
        <Ionicons name="chevron-back" size={20} color={colors.text.primary} />
      </TouchableOpacity>
      <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerSide}>
        {rightSlot ?? null}
      </View>
    </View>
  );
}

export function SettingsSection({
  title,
  description,
  children,
  style,
}: SettingsSectionProps) {
  return (
    <View style={style}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
      {description ? <Text style={styles.sectionDescription}>{description}</Text> : null}
      {children}
    </View>
  );
}

export function SettingsSurface({
  children,
  style,
  tone = 'subtle',
}: SettingsSurfaceProps) {
  return (
    <View
      style={[
        styles.surface,
        tone === 'danger' ? styles.surfaceDanger : styles.surfaceSubtle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SettingsTextField({
  label,
  helperText,
  metaText,
  style,
  ...props
}: SettingsTextFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View style={[styles.fieldShell, focused && styles.fieldShellFocused]}>
        <RNTextInput
          {...props}
          placeholderTextColor={colors.text.tertiary}
          selectionColor={colors.accent.primary}
          showSoftInputOnFocus
          style={[styles.fieldInput, style]}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
        />
      </View>
      {helperText || metaText ? (
        <View style={styles.fieldMetaRow}>
          <Text style={styles.helperText}>{helperText ?? ' '}</Text>
          {metaText ? <Text style={styles.metaText}>{metaText}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

export function SettingsSwitchRow({
  label,
  description,
  value,
  onValueChange,
}: SettingsSwitchRowProps) {
  return (
    <SettingsSurface style={[styles.switchRow, description ? styles.switchRowComfortable : null]}>
      <View style={styles.switchTextBlock}>
        <Text style={styles.switchLabel}>{label}</Text>
        {description ? <Text style={styles.switchDescription}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: colors.line.strong,
          true: colors.accent.primary,
        }}
        thumbColor={colors.white}
      />
    </SettingsSurface>
  );
}

export function BottomCtaBar({ children }: { children: React.ReactNode }) {
  return <BottomActionBar>{children}</BottomActionBar>;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPaddingH,
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.bg.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.title.l,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  headerSide: {
    width: 44,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    ...typography.body.m,
    color: colors.text.tertiary,
    marginBottom: spacing[3],
  },
  sectionDescription: {
    ...typography.body.m,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },
  surface: {
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  surfaceSubtle: {
    backgroundColor: colors.bg.subtle,
  },
  surfaceDanger: {
    backgroundColor: colors.bg.dangerSoft,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing[2],
  },
  fieldShell: {
    minHeight: component.input.height,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line.default,
    backgroundColor: colors.bg.subtle,
    justifyContent: 'center',
    paddingHorizontal: component.input.horizontalPadding,
  },
  fieldShellFocused: {
    borderColor: colors.line.strong,
  },
  fieldInput: {
    ...typography.body.l,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  fieldMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing[2],
    gap: spacing[2],
  },
  helperText: {
    ...typography.caption,
    color: colors.text.tertiary,
    flex: 1,
  },
  metaText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  switchRow: {
    minHeight: component.toggleRow.heightComfortable,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  switchRowComfortable: {
    alignItems: 'flex-start',
  },
  switchTextBlock: {
    flex: 1,
    gap: spacing[1],
    paddingRight: spacing[2],
  },
  switchLabel: {
    ...typography.body.l,
    color: colors.text.primary,
  },
  switchDescription: {
    ...typography.body.m,
    color: colors.text.secondary,
  },
});
