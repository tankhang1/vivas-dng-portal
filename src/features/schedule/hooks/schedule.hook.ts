import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  confirmScheduleMeetProcess,
  getSchedulesByCategory,
  resolveScheduleMeetProcess,
} from "@/features/schedule/api/schedule.api";
import type { ConfirmScheduleMeetProcessRequest } from "@/features/schedule/types/confirm-schedule-meet-process.request";
import type { ConfirmScheduleMeetProcessResponse } from "@/features/schedule/types/confirm-schedule-meet-process.response";
import type { GetSchedulesByCategoryRequest } from "@/features/schedule/types/get-schedules-by-category.request";
import type { GetSchedulesResponse } from "@/features/schedule/types/get-schedules.response";
import type { ResolveScheduleMeetProcessRequest } from "@/features/schedule/types/resolve-schedule-meet-process.request";
import type { ResolveScheduleMeetProcessResponse } from "@/features/schedule/types/resolve-schedule-meet-process.response";
import { QUERY_KEY } from "@/shared/api";

export function useConfirmScheduleMeetProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ConfirmScheduleMeetProcessResponse,
    Error,
    ConfirmScheduleMeetProcessRequest
  >({
    mutationFn: confirmScheduleMeetProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useResolveScheduleMeetProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ResolveScheduleMeetProcessResponse,
    Error,
    ResolveScheduleMeetProcessRequest
  >({
    mutationFn: resolveScheduleMeetProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useSchedulesByCategoryQuery(
  request: GetSchedulesByCategoryRequest,
  enabled = true,
) {
  const { categoryId, sz, nu } = request;

  return useQuery<GetSchedulesResponse>({
    queryKey: QUERY_KEY.SCHEDULES_BY_CATEGORY(categoryId, { sz, nu }),
    queryFn: () => getSchedulesByCategory(request),
    placeholderData: keepPreviousData,
    enabled:
      enabled &&
      categoryId !== undefined &&
      categoryId !== null &&
      categoryId !== "",
  });
}
