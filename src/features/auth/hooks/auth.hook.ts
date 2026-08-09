import { useMutation } from '@tanstack/react-query';

import { login } from '@/features/auth/api/auth.api';
import type { AuthLoginRequest } from '@/features/auth/types/auth.request';
import type { AuthLoginResponse } from '@/features/auth/types/auth.response';

export function useLoginMutation() {
  return useMutation<AuthLoginResponse, Error, AuthLoginRequest>({
    mutationFn: login,
  });
}
