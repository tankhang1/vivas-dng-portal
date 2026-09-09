import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getNumbersByQueue, getQueue } from "@/features/queue/api/queue.api";
import type { GetNumbersByQueueRequest } from "@/features/queue/types/get-numbers-by-queue.request";
import type { GetNumbersByQueueResponse } from "@/features/queue/types/get-numbers-by-queue.response";
import type { GetQueueResponse } from "@/features/queue/types/get-queue.response";
import { QUERY_KEY } from "@/shared/api";

export function useQueueQuery() {
  return useQuery<GetQueueResponse>({
    queryKey: QUERY_KEY.QUEUE,
    queryFn: getQueue,
  });
}

export function useNumbersByQueueQuery(
  request: GetNumbersByQueueRequest,
  enabled = true,
) {
  const { queueId, sz, nu } = request;

  return useQuery<GetNumbersByQueueResponse>({
    queryKey: QUERY_KEY.NUMBERS_BY_QUEUE(queueId, { sz, nu }),
    queryFn: () => getNumbersByQueue(request),
    placeholderData: keepPreviousData,
    enabled:
      enabled &&
      queueId !== undefined &&
      queueId !== null &&
      queueId !== "",
  });
}

export function useInfiniteNumbersByQueueQuery(
  request: Omit<GetNumbersByQueueRequest, "nu">,
  enabled = true,
) {
  const { queueId, sz } = request;

  return useInfiniteQuery<GetNumbersByQueueResponse>({
    queryKey: QUERY_KEY.NUMBERS_BY_QUEUE(queueId, { sz }),
    queryFn: ({ pageParam }) =>
      getNumbersByQueue({ ...request, nu: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
    enabled:
      enabled &&
      queueId !== undefined &&
      queueId !== null &&
      queueId !== "",
  });
}
