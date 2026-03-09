import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/theme/tokens';
import { Button } from '@/components/ui';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface EmptyStateProps {
  icon: IoniconsName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, actionLabel, onAction }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={56} color={colors.text.tertiary} style={styles.icon} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
    {actionLabel && onAction && (
      <Button title={actionLabel} onPress={onAction} variant="primary" size="md" style={styles.button} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[12],
  },
  icon: {
    marginBottom: spacing[4],
  },
  title: {
    ...typography.heading.m,
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  description: {
    ...typography.body.m,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[5],
  },
  button: {
    marginTop: spacing[4],
  },
});
