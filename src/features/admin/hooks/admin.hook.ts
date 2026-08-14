import { useMutation } from '@tanstack/react-query';

import { signup } from '@/features/admin/api/admin.api';
import type { AdminSignupRequest } from '@/features/admin/types/signup.request';
import type { AdminSignupResponse } from '@/features/admin/types/signup.response';

export function useSignupMutation() {
  return useMutation<AdminSignupResponse, Error, AdminSignupRequest>({
    mutationFn: signup,
  });
}
