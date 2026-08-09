import { useMutation } from '@tanstack/react-query';

import { login } from '../api/auth.api';
import type { AuthLoginRequest } from '../types/auth.request';
import type { AuthLoginResponse } from '../types/auth.response';

export function useLoginMutation() {
  return useMutation<AuthLoginResponse, Error, AuthLoginRequest>({
    mutationFn: login,
  });
}
