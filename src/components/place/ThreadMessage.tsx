import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThreadMessage as ThreadMessageType } from '@/types';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { formatRelative } from '@/utils/date';

interface ThreadMessageProps {
  message: ThreadMessageType;
  authorName?: string;
  isMine: boolean;
  onLongPressMine?: () => void;
}

export const ThreadMessageComponent: React.FC<ThreadMessageProps> = ({
  message,
  authorName,
  isMine,
  onLongPressMine,
}) => {
  return (
    <View style={[styles.container, isMine && styles.containerMine]}>
      <TouchableOpacity
        activeOpacity={isMine ? 0.86 : 1}
        delayLongPress={300}
        disabled={!isMine}
        onLongPress={isMine ? onLongPressMine : undefined}
        style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubblePartner]}
      >
        {!isMine && <Text style={styles.authorName}>{authorName ?? '?'}</Text>}
        <Text style={styles.content}>{message.body}</Text>
        <View style={styles.meta}>
          <Text style={styles.time}>{formatRelative(message.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing[3],
  },
  containerMine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: radius.md,
    padding: spacing[3],
  },
  bubbleMine: {
    backgroundColor: colors.accent.primarySoft,
    borderBottomRightRadius: 4,
  },
  bubblePartner: {
    backgroundColor: colors.bg.elevated,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border.soft,
  },
  authorName: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  content: {
    ...typography.body.m,
    color: colors.text.primary,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  time: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 11,
  },
});
