import {
  API_PATH,
  apiClient,
  setAccessToken,
  setCurrentStaff,
} from "@/shared/api";
import type { AuthLoginRequest } from "@/features/auth/types/auth.request";
import type { AuthLoginResponse } from "@/features/auth/types/auth.response";
import type { CheckTokenExpiredRequest } from "@/features/auth/types/check-token-expired.request";
import type { CheckTokenExpiredResponse } from "@/features/auth/types/check-token-expired.response";

export async function login(
  request: AuthLoginRequest,
): Promise<AuthLoginResponse> {
  const response = await apiClient.post<AuthLoginResponse>(
    API_PATH.AUTH.LOGIN,
    request,
  );
  setAccessToken(response.data.token);
  setCurrentStaff(
    response.data.staff_item,
    response.data.staff_name,
    response.data.roles,
  );
  return response.data;
}

export async function checkTokenExpired(
  request: CheckTokenExpiredRequest,
): Promise<CheckTokenExpiredResponse> {
  const response = await apiClient.post<CheckTokenExpiredResponse>(
    API_PATH.AUTH.CHECK_TOKEN_EXPIRED,
    request,
  );

  return response.data;
}

export async function refreshToken(): Promise<string> {
  const response = await apiClient.post<{ data: string }>(
    API_PATH.AUTH.REFRESH_TOKEN,
  );

  setAccessToken(response.data.data);
  return response.data.data;
}
