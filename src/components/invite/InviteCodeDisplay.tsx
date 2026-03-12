import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius } from '@/theme/tokens';
import { InviteCode } from '@/types';
import { getRemainingHours, isExpired } from '@/utils/date';
import { Button } from '@/components/ui';

interface InviteCodeDisplayProps {
  invite: InviteCode;
  onRevoke?: () => void;
  onCopy?: () => void;
  showLabel?: boolean;
}

export const InviteCodeDisplay: React.FC<InviteCodeDisplayProps> = ({
  invite,
  onRevoke,
  onCopy,
  showLabel = true,
}) => {
  const [remainingHours, setRemainingHours] = useState(getRemainingHours(invite.expiresAt));
  const expired = isExpired(invite.expiresAt) || invite.status !== 'active';

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingHours(getRemainingHours(invite.expiresAt));
    }, 60000);
    return () => clearInterval(interval);
  }, [invite.expiresAt]);

  return (
    <View style={styles.container}>
      {showLabel ? <Text style={styles.label}>초대 코드</Text> : null}
      <View style={styles.codeBox}>
        <Text style={styles.code}>{invite.code}</Text>
      </View>
      <Text style={[styles.timer, expired && styles.timerExpired]}>
        {expired ? '만료됨' : `${remainingHours}시간 남음`}
      </Text>
      {!expired && (onCopy || onRevoke) ? (
        <View style={styles.actions}>
          {onCopy ? (
            <Button
              title="복사"
              onPress={onCopy}
              variant="soft-secondary"
              size="md"
              style={styles.actionBtn}
            />
          ) : null}
          {onRevoke ? (
            <Button
              title="무효화"
              onPress={onRevoke}
              variant="ghost-danger"
              size="md"
              style={styles.actionBtn}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing[1],
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing[4],
  },
  codeBox: {
    backgroundColor: colors.bg.canvas,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[8],
    marginBottom: spacing[4],
    borderWidth: 2,
    borderColor: colors.accent.primary,
    borderStyle: 'dashed',
  },
  code: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.accent.primary,
    letterSpacing: 6,
  },
  timer: {
    ...typography.caption,
    color: colors.accent.amber,
    marginBottom: spacing[4],
  },
  timerExpired: {
    color: colors.accent.danger,
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing[3],
  },
  actionBtn: {
    borderRadius: radius.full,
  },
});
