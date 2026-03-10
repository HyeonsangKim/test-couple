import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThreadMessage as ThreadMessageType } from '@/types';
import { colors, typography, spacing, radius, component } from '@/theme/tokens';
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
  const author = getUserById(message.authorUserId);
  const isMine = message.authorUserId === CURRENT_USER_ID;

  return (
    <View style={[styles.container, isMine && styles.containerMine]}>
      {!isMine && (
        <Avatar user={author} name={author?.nickname ?? '?'} color={colors.text.tertiary} size={component.avatar.sm} />
      )}
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubblePartner]}>
        {!isMine && <Text style={styles.authorName}>{author?.nickname}</Text>}
        <Text style={styles.content}>{message.body}</Text>
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
        <Avatar user={author} name={author?.nickname ?? '?'} color={colors.accent.primary} size={component.avatar.sm} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing[4],
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  containerMine: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '70%',
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  bubbleMine: {
    backgroundColor: colors.bg.soft,
    borderBottomRightRadius: 4,
  },
  bubblePartner: {
    backgroundColor: colors.bg.elevated,
    borderBottomLeftRadius: 4,
  },
  authorName: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '600',
    marginBottom: spacing[1],
  },
  content: {
    ...typography.body.m,
    color: colors.text.primary,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  time: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
    marginLeft: spacing[4],
  },
  actionText: {
    ...typography.caption,
    color: colors.accent.primary,
    fontWeight: '600',
  },
  deleteText: {
    color: colors.accent.danger,
  },
});
