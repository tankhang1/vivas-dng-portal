import { API_PATH, apiClient } from "@/shared/api";
import type { CreateHotlineProcessRequest } from "@/features/hotline/types/create-hotline-process.request";
import type { CreateHotlineProcessResponse } from "@/features/hotline/types/create-hotline-process.response";
import type { GetHotlineResponse } from "@/features/hotline/types/get-hotline.response";
import type { RemoveHotlineProcessRequest } from "@/features/hotline/types/remove-hotline-process.request";
import type { RemoveHotlineProcessResponse } from "@/features/hotline/types/remove-hotline-process.response";

export async function createHotlineProcess(
  request: CreateHotlineProcessRequest,
): Promise<CreateHotlineProcessResponse> {
  const response = await apiClient.post<CreateHotlineProcessResponse>(
    API_PATH.HOTLINE.CREATE_PROCESS,
    request,
  );

  return response.data;
}

export async function getHotline(): Promise<GetHotlineResponse> {
  const response = await apiClient.get<GetHotlineResponse>(API_PATH.COMMON.HOTLINE);

  return response.data;
}

export async function removeHotlineProcess(
  request: RemoveHotlineProcessRequest,
): Promise<RemoveHotlineProcessResponse> {
  const response = await apiClient.post<RemoveHotlineProcessResponse>(
    API_PATH.HOTLINE.REMOVE_PROCESS,
    request,
  );

  return response.data;
}
