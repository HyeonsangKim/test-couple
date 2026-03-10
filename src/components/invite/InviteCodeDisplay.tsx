import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radius, shadow, component } from '@/theme/tokens';
import { InviteCode } from '@/types';
import { getRemainingHours, isExpired } from '@/utils/date';
import { Button } from '@/components/ui';

interface InviteCodeDisplayProps {
  invite: InviteCode;
  onRevoke: () => void;
}

export const InviteCodeDisplay: React.FC<InviteCodeDisplayProps> = ({ invite, onRevoke }) => {
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
      <Text style={styles.label}>초대 코드</Text>
      <View style={styles.codeBox}>
        <Text style={styles.code}>{invite.code}</Text>
      </View>
      <Text style={[styles.timer, expired && styles.timerExpired]}>
        {expired ? '만료됨' : `${remainingHours}시간 남음`}
      </Text>
      {!expired && (
        <Button title="코드 무효화" onPress={onRevoke} variant="ghost" size="sm" style={styles.revokeBtn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: component.card.padding,
    backgroundColor: colors.bg.elevated,
    borderRadius: component.card.radius,
    ...shadow.md,
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
  revokeBtn: {
    marginTop: spacing[2],
  },
});
