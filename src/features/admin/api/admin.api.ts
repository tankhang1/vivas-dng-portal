import { API_PATH, apiClient } from "@/shared/api";
import type { AdminSignupRequest } from "@/features/admin/types/signup.request";
import type { AdminSignupResponse } from "@/features/admin/types/signup.response";

export async function signup(
  request: AdminSignupRequest,
): Promise<AdminSignupResponse> {
  const response = await apiClient.post<AdminSignupResponse>(
    API_PATH.ADMIN.SIGNUP,
    request,
  );

  return response.data;
}
