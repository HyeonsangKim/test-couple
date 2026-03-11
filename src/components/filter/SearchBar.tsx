import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, component } from '@/theme/tokens';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  variant?: 'solid' | 'glass';
  style?: StyleProp<ViewStyle>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = '장소 검색...',
  onClear,
  variant = 'solid',
  style,
}) => (
  <View style={[styles.container, style]}>
    <Ionicons name="search" size={component.searchBar.icon} color={colors.text.tertiary} style={styles.icon} />
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.text.tertiary}
      returnKeyType="search"
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
        <Ionicons name="close-circle" size={16} color={colors.text.tertiary} />
      </TouchableOpacity>
    )}
  </View>
);

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
