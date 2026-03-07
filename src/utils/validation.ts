import { LIMITS } from '@/constants';

export const validateThreadMessage = (content: string): string | null => {
  if (!content.trim()) return '메시지를 입력해주세요.';
  if (content.length > LIMITS.MAX_THREAD_MESSAGE_LENGTH) return `${LIMITS.MAX_THREAD_MESSAGE_LENGTH}자까지 입력 가능합니다.`;
  return null;
};

export const validatePlaceName = (name: string): string | null => {
  if (!name.trim()) return '장소 이름을 입력해주세요.';
  if (name.length > LIMITS.MAX_PLACE_NAME_LENGTH) return `${LIMITS.MAX_PLACE_NAME_LENGTH}자까지 입력 가능합니다.`;
  return null;
};

export const validateInviteCode = (code: string): string | null => {
  if (!code.trim()) return '초대 코드를 입력해주세요.';
  if (code.length !== 6) return '6자리 코드를 입력해주세요.';
  return null;
};

export const validatePassword = (pw: string): string | null => {
  if (!pw.trim()) return '비밀번호를 입력해주세요.';
  if (pw.length < 4) return '4자 이상 입력해주세요.';
  return null;
};
