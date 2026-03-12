import {
  addDays,
  addHours,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isAfter,
  isSameDay,
  parseISO,
} from 'date-fns';

export const formatDate = (dateStr: string): string =>
  format(parseISO(dateStr), 'yyyy.MM.dd');

export const formatDateTime = (dateStr: string): string =>
  format(parseISO(dateStr), 'yyyy.MM.dd HH:mm');

export const formatRelative = (dateStr: string): string => {
  const targetDate = parseISO(dateStr);
  const now = new Date();

  if (!isSameDay(targetDate, now)) {
    return format(targetDate, 'M월 d일');
  }

  const minutesAgo = differenceInMinutes(now, targetDate);

  if (minutesAgo < 1) {
    return '방금';
  }

  if (minutesAgo < 60) {
    return `${minutesAgo}분 전`;
  }

  return `${differenceInHours(now, targetDate)}시간 전`;
};

export const getRemainingHours = (expiresAt: string): number =>
  Math.max(0, differenceInHours(parseISO(expiresAt), new Date()));

export const getRemainingDays = (expiresAt: string): number =>
  Math.max(0, differenceInDays(parseISO(expiresAt), new Date()));

export const isExpired = (expiresAt: string): boolean =>
  isAfter(new Date(), parseISO(expiresAt));

export { addDays, addHours, parseISO, format };
