import { API_PATH, apiClient } from '../../../shared/api';
import type { AuthLoginRequest } from '../types/auth.request';
import type { AuthLoginResponse } from '../types/auth.response';

export async function login(
  request: AuthLoginRequest,
): Promise<AuthLoginResponse> {
  const response = await apiClient.post<AuthLoginResponse>(API_PATH.AUTH.LOGIN, request);
  return response.data;
}
