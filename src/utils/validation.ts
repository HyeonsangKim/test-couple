import { LIMITS } from '@/constants';

export const validateThreadMessage = (body: string): string | null => {
  if (!body.trim()) return '메시지를 입력해주세요.';
  if (body.length > LIMITS.MAX_THREAD_MESSAGE_LENGTH) return `${LIMITS.MAX_THREAD_MESSAGE_LENGTH}자까지 입력 가능합니다.`;
  return null;
};

export const validatePlaceName = (name: string): string | null => {
  if (!name.trim()) return '장소 이름을 입력해주세요.';
  if (name.length > LIMITS.MAX_PLACE_NAME_LENGTH) return `${LIMITS.MAX_PLACE_NAME_LENGTH}자까지 입력 가능합니다.`;
  return null;
};

export const validateInviteCode = (code: string): string | null => {
  if (!code.trim()) return '초대 코드를 입력해주세요.';
  if (code.length !== LIMITS.MAX_INVITE_CODE_LENGTH) return `${LIMITS.MAX_INVITE_CODE_LENGTH}자리 코드를 입력해주세요.`;
  if (!/^[A-Za-z0-9]+$/.test(code)) return '영문과 숫자만 입력 가능합니다.';
  return null;
};

export const validateNickname = (nickname: string): string | null => {
  const trimmed = nickname.trim();
  if (trimmed.length < LIMITS.MIN_NICKNAME_LENGTH) return '닉네임을 입력해주세요.';
  if (trimmed.length > LIMITS.MAX_NICKNAME_LENGTH) return `${LIMITS.MAX_NICKNAME_LENGTH}자까지 입력 가능합니다.`;
  return null;
};
