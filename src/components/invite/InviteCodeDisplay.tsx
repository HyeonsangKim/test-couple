import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, radius, shadow } from '@/theme/tokens';
import { InviteCode } from '@/types';
import { getRemainingHours, isExpired } from '@/utils/date';
import { Button } from '@/components/ui';

interface InviteCodeDisplayProps {
  invite: InviteCode;
  onRevoke: () => void;
}

export const InviteCodeDisplay: React.FC<InviteCodeDisplayProps> = ({ invite, onRevoke }) => {
  const [remainingHours, setRemainingHours] = useState(getRemainingHours(invite.expiresAt));
  const expired = isExpired(invite.expiresAt);

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
      <Text style={styles.password}>비밀번호: {invite.password}</Text>
      <Text style={[styles.timer, expired && styles.timerExpired]}>
        {expired ? '만료됨' : `${remainingHours}시간 남음`}
      </Text>
      <Button title="코드 무효화" onPress={onRevoke} variant="ghost" size="sm" style={styles.revokeBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    ...shadow.md,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  codeBox: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxxl,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  code: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 6,
  },
  password: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  timer: {
    ...typography.captionBold,
    color: colors.warning,
    marginBottom: spacing.lg,
  },
  timerExpired: {
    color: colors.error,
  },
  revokeBtn: {
    marginTop: spacing.sm,
  },
});
