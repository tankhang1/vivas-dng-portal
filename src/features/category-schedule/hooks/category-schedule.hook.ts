import { useQuery } from "@tanstack/react-query";

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
