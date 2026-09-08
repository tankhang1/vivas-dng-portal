import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getScheduleCategories } from "@/features/category-schedule/api/category-schedule.api";
import type { GetCategoriesResponse } from "@/features/category-news/types/get-categories.response";
import type { SearchCategoriesRequest } from "@/features/category-news/types/search-categories.request";
import { QUERY_KEY } from "@/shared/api";

export function useScheduleCategoriesQuery(request: SearchCategoriesRequest = {}) {
  return useQuery<GetCategoriesResponse>({
    queryKey: QUERY_KEY.SCHEDULE_CATEGORIES(request),
    queryFn: () => getScheduleCategories(request),
  });
}

export function useInfiniteScheduleCategoriesQuery(
  request: Omit<SearchCategoriesRequest, "nu"> = {},
  enabled = true,
) {
  const { sz } = request;

  return useInfiniteQuery<GetCategoriesResponse>({
    queryKey: QUERY_KEY.SCHEDULE_CATEGORIES({ sz }),
    queryFn: ({ pageParam }) =>
      getScheduleCategories({ ...request, nu: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
    enabled,
  });
}
