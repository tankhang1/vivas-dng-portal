import { API_PATH, apiClient } from "@/shared/api";
import type { CreateDivisionProcessRequest } from "@/features/division/types/create-division-process.request";
import type { CreateDivisionProcessResponse } from "@/features/division/types/create-division-process.response";
import type { GetDivisionResponse } from "@/features/division/types/get-division.response";
import type { GetDivisionsResponse } from "@/features/division/types/get-divisions.response";
import type { EditDivisionProcessRequest } from "@/features/division/types/edit-division-process.request";
import type { RemoveDivisionProcessRequest } from "@/features/division/types/remove-division-process.request";
import type { RemoveDivisionProcessResponse } from "@/features/division/types/remove-division-process.response";

export async function createDivisionProcess(
  request: CreateDivisionProcessRequest,
): Promise<CreateDivisionProcessResponse> {
  const response = await apiClient.post<CreateDivisionProcessResponse>(
    API_PATH.DIVISION.CREATE_PROCESS,
    request,
  );

  return response.data;
}

export async function editDivisionProcess(
  request: EditDivisionProcessRequest,
): Promise<CreateDivisionProcessResponse> {
  const response = await apiClient.post<CreateDivisionProcessResponse>(
    API_PATH.DIVISION.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function removeDivisionProcess(
  request: RemoveDivisionProcessRequest,
): Promise<RemoveDivisionProcessResponse> {
  const response = await apiClient.post<RemoveDivisionProcessResponse>(
    API_PATH.DIVISION.REMOVE_PROCESS,
    request,
  );

  return response.data;
}

export async function getDivisions(): Promise<GetDivisionsResponse> {
  const response = await apiClient.get<GetDivisionsResponse>(
    API_PATH.COMMON.DIVISIONS,
  );

  return response.data;
}

export async function getDivisionById(
  id: number | string,
): Promise<GetDivisionResponse> {
  const response = await apiClient.get<GetDivisionResponse>(
    `${API_PATH.COMMON.DIVISION}/${id}`,
  );

  return response.data;
}
