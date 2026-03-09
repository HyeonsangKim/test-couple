import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadow, glass } from '@/theme/tokens';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  iconFocused: IoniconsName;
}

const TABS: TabConfig[] = [
  { name: 'map', title: '지도', icon: 'map-outline', iconFocused: 'map' },
  { name: 'list', title: '리스트', icon: 'list-outline', iconFocused: 'list' },
  { name: 'my', title: 'MY', icon: 'person-outline', iconFocused: 'person' },
];

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, 12),
          left: 20,
          right: 20,
          height: 64,
          borderRadius: radius.xl,
          backgroundColor: glass.fallback.background,
          borderWidth: glass.border.width,
          borderColor: glass.border.color,
          borderTopWidth: glass.border.width,
          borderTopColor: glass.border.color,
          ...shadow.md,
          elevation: 8,
          paddingBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: spacing[2],
        },
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          ...typography.caption,
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
