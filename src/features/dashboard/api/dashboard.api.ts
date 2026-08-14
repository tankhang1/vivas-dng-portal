import { API_PATH, apiClient } from "@/shared/api";
import type { EditDashboardProcessRequest } from "@/features/dashboard/types/edit-dashboard-process.request";
import type { EditDashboardProcessResponse } from "@/features/dashboard/types/edit-dashboard-process.response";
import type { GetDashboardResponse } from "@/features/dashboard/types/get-dashboard.response";

export async function editDashboardProcess(
  request: EditDashboardProcessRequest,
): Promise<EditDashboardProcessResponse> {
  const response = await apiClient.post<EditDashboardProcessResponse>(
    API_PATH.DASHBOARD.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function getDashboard(): Promise<GetDashboardResponse> {
  const response = await apiClient.get<GetDashboardResponse>(
    API_PATH.COMMON.DASHBOARD,
  );

  return response.data;
}
