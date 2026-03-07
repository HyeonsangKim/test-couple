import { useState, useEffect } from 'react';
import { DeleteRequest } from '@/types';
import { getRemainingDays, getRemainingHours, isExpired } from '@/utils/date';

interface GracePeriodInfo {
  isActive: boolean;
  remainingDays: number;
  remainingHours: number;
  isExpired: boolean;
}

export const useDeleteGracePeriod = (deleteRequest: DeleteRequest | null): GracePeriodInfo => {
  const [info, setInfo] = useState<GracePeriodInfo>({
    isActive: false,
    remainingDays: 0,
    remainingHours: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!deleteRequest) {
      setInfo({ isActive: false, remainingDays: 0, remainingHours: 0, isExpired: false });
      return;
    }

    const update = () => {
      setInfo({
        isActive: true,
        remainingDays: getRemainingDays(deleteRequest.expiresAt),
        remainingHours: getRemainingHours(deleteRequest.expiresAt),
        isExpired: isExpired(deleteRequest.expiresAt),
      });
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [deleteRequest]);

  return info;
};
