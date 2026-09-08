import { API_PATH, apiClient } from "@/shared/api";
import type { ConfirmScheduleMeetProcessRequest } from "@/features/schedule/types/confirm-schedule-meet-process.request";
import type { ConfirmScheduleMeetProcessResponse } from "@/features/schedule/types/confirm-schedule-meet-process.response";
import type { GetSchedulesByCategoryRequest } from "@/features/schedule/types/get-schedules-by-category.request";
import type { GetSchedulesResponse } from "@/features/schedule/types/get-schedules.response";
import type { GetTimeScheduleResponse } from "@/features/schedule/types/get-time-schedule.response";
import type { ResolveScheduleMeetProcessRequest } from "@/features/schedule/types/resolve-schedule-meet-process.request";
import type { ResolveScheduleMeetProcessResponse } from "@/features/schedule/types/resolve-schedule-meet-process.response";

export async function confirmScheduleMeetProcess(
  request: ConfirmScheduleMeetProcessRequest,
): Promise<ConfirmScheduleMeetProcessResponse> {
  const response = await apiClient.post<ConfirmScheduleMeetProcessResponse>(
    API_PATH.SCHEDULE.CONFIRM_PROCESS,
    request,
  );

  return response.data;
}

export async function resolveScheduleMeetProcess(
  request: ResolveScheduleMeetProcessRequest,
): Promise<ResolveScheduleMeetProcessResponse> {
  const response = await apiClient.post<ResolveScheduleMeetProcessResponse>(
    API_PATH.SCHEDULE.RESOLVE_PROCESS,
    request,
  );

  return response.data;
}

export async function getTimeSchedule(): Promise<GetTimeScheduleResponse> {
  const response = await apiClient.get<GetTimeScheduleResponse>(
    API_PATH.COMMON.TIME_SCHEDULE,
  );

  return response.data;
}

export async function getSchedulesByCategory(
  request: GetSchedulesByCategoryRequest,
): Promise<GetSchedulesResponse> {
  const params = new URLSearchParams();

  if (request.sz !== undefined) {
    params.append("sz", String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append("nu", String(request.nu));
  }

  const query = params.toString();
  const response = await apiClient.get<GetSchedulesResponse>(
    query
      ? `${API_PATH.COMMON_PORTAL.SCHEDULES_BY_CATEGORY(request.categoryId)}?${query}`
      : API_PATH.COMMON_PORTAL.SCHEDULES_BY_CATEGORY(request.categoryId),
  );

  return response.data;
}
