import { API_PATH, apiClient } from "@/shared/api";
import type { UpdatePasswordProcessRequest } from "@/features/account/types/update-password-process.request";
import type { UpdatePasswordProcessResponse } from "@/features/account/types/update-password-process.response";

export async function updatePasswordProcess(
  request: UpdatePasswordProcessRequest,
): Promise<UpdatePasswordProcessResponse> {
  const response = await apiClient.post<UpdatePasswordProcessResponse>(
    API_PATH.ACCOUNT.UPDATE_PASSWORD_PROCESS,
    request,
  );

  return response.data;
}
