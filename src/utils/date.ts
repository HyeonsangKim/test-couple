import { format, formatDistanceToNow, differenceInHours, differenceInDays, addDays, addHours, parseISO, isAfter } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatDate = (dateStr: string): string =>
  format(parseISO(dateStr), 'yyyy.MM.dd');

export const formatDateTime = (dateStr: string): string =>
  format(parseISO(dateStr), 'yyyy.MM.dd HH:mm');

export const formatRelative = (dateStr: string): string =>
  formatDistanceToNow(parseISO(dateStr), { addSuffix: true, locale: ko });

export const getRemainingHours = (expiresAt: string): number =>
  Math.max(0, differenceInHours(parseISO(expiresAt), new Date()));

export const getRemainingDays = (expiresAt: string): number =>
  Math.max(0, differenceInDays(parseISO(expiresAt), new Date()));

export const isExpired = (expiresAt: string): boolean =>
  isAfter(new Date(), parseISO(expiresAt));

export { addDays, addHours, parseISO, format };
