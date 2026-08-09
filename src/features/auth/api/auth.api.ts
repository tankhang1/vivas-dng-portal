import { API_PATH, apiClient, setAccessToken } from '@/shared/api';
import type { AuthLoginRequest } from '@/features/auth/types/auth.request';
import type { AuthLoginResponse } from '@/features/auth/types/auth.response';

export async function login(
  request: AuthLoginRequest,
): Promise<AuthLoginResponse> {
  const response = await apiClient.post<AuthLoginResponse>(API_PATH.AUTH.LOGIN, request);
  setAccessToken(response.data.token);
  return response.data;
}
