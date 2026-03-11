import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, component } from '@/theme/tokens';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  variant?: 'solid' | 'glass';
  style?: StyleProp<ViewStyle>;
  onFocus?: RNTextInputProps['onFocus'];
  onBlur?: RNTextInputProps['onBlur'];
  onSubmitEditing?: RNTextInputProps['onSubmitEditing'];
  autoFocus?: boolean;
}

export const SearchBar = React.forwardRef<TextInput, SearchBarProps>(({
  value,
  onChangeText,
  placeholder = '장소 검색...',
  onClear,
  variant = 'solid',
  style,
  onFocus,
  onBlur,
  onSubmitEditing,
  autoFocus = false,
}, ref) => (
  <View style={[styles.container, style]}>
    <Ionicons name="search" size={component.searchBar.icon} color={colors.text.tertiary} style={styles.icon} />
    <TextInput
      ref={ref}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.text.tertiary}
      returnKeyType="search"
      onFocus={onFocus}
      onBlur={onBlur}
      onSubmitEditing={onSubmitEditing}
      autoFocus={autoFocus}
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
        <Ionicons name="close-circle" size={16} color={colors.text.tertiary} />
      </TouchableOpacity>
    )}
  </View>
));

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: component.searchBar.height,
    borderRadius: component.searchBar.radius,
    paddingHorizontal: component.searchBar.horizontalPadding,
    backgroundColor: colors.bg.subtle,
    borderWidth: 1,
    borderColor: colors.line.default,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...typography.body.l,
    color: colors.text.primary,
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
});
