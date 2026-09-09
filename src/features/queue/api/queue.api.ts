import { API_PATH, apiClient } from "@/shared/api";
import type { GetNumbersByQueueRequest } from "@/features/queue/types/get-numbers-by-queue.request";
import type { GetNumbersByQueueResponse } from "@/features/queue/types/get-numbers-by-queue.response";
import type { GetQueueResponse } from "@/features/queue/types/get-queue.response";

export async function getQueue(): Promise<GetQueueResponse> {
  const response = await apiClient.get<GetQueueResponse>(API_PATH.COMMON.QUEUE);

  return response.data;
}

export async function getNumbersByQueue(
  request: GetNumbersByQueueRequest,
): Promise<GetNumbersByQueueResponse> {
  const params = new URLSearchParams();

  if (request.sz !== undefined) {
    params.append("sz", String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append("nu", String(request.nu));
  }

  const query = params.toString();
  const response = await apiClient.get<GetNumbersByQueueResponse>(
    query
      ? `${API_PATH.COMMON_PORTAL.NUMBERS_BY_QUEUE(request.queueId)}?${query}`
      : API_PATH.COMMON_PORTAL.NUMBERS_BY_QUEUE(request.queueId),
  );

  return response.data;
}
