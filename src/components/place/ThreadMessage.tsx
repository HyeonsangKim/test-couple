import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThreadMessage as ThreadMessageType } from '@/types';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { Avatar } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatRelative } from '@/utils/date';
import { CURRENT_USER_ID } from '@/mock/data';

interface ThreadMessageProps {
  message: ThreadMessageType;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ThreadMessageComponent: React.FC<ThreadMessageProps> = ({ message, onEdit, onDelete }) => {
  const getUserById = useAuthStore((s) => s.getUserById);
  const author = getUserById(message.authorId);
  const isMine = message.authorId === CURRENT_USER_ID;

  return (
    <View style={[styles.container, isMine && styles.containerMine]}>
      {!isMine && (
        <Avatar name={author?.nickname ?? '?'} color={author?.profileColor ?? colors.textTertiary} size={32} />
      )}
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubblePartner]}>
        {!isMine && <Text style={styles.authorName}>{author?.nickname}</Text>}
        <Text style={styles.content}>{message.content}</Text>
        <View style={styles.meta}>
          <Text style={styles.time}>{formatRelative(message.createdAt)}</Text>
          {isMine && (
            <View style={styles.actions}>
              {onEdit && (
                <TouchableOpacity onPress={onEdit}>
                  <Text style={styles.actionText}>수정</Text>
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity onPress={onDelete}>
                  <Text style={[styles.actionText, styles.deleteText]}>삭제</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
      {isMine && (
        <Avatar name={author?.nickname ?? '?'} color={author?.profileColor ?? colors.primary} size={32} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  containerMine: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '70%',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  bubbleMine: {
    backgroundColor: colors.bubbleMine,
    borderBottomRightRadius: 4,
  },
  bubblePartner: {
    backgroundColor: colors.bubblePartner,
    borderBottomLeftRadius: 4,
  },
  authorName: {
    ...typography.captionBold,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  content: {
    ...typography.body,
    color: colors.text,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  time: {
    ...typography.small,
    color: colors.textTertiary,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginLeft: spacing.md,
  },
  actionText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteText: {
    color: colors.error,
  },
});
