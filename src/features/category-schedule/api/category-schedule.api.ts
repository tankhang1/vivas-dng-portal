import { API_PATH, apiClient } from "@/shared/api";
import type { GetCategoriesResponse } from "@/features/category-news/types/get-categories.response";
import type { SearchCategoriesRequest } from "@/features/category-news/types/search-categories.request";

export const SCHEDULE_CATEGORY_TYPE = 4;

export async function getScheduleCategories(
  request: SearchCategoriesRequest = {},
): Promise<GetCategoriesResponse> {
  const params = new URLSearchParams();

  if (request.sz !== undefined) {
    params.append("sz", String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append("nu", String(request.nu));
  }

  const query = params.toString();
  const response = await apiClient.get<GetCategoriesResponse>(
    query
      ? `${API_PATH.COMMON.CATEGORIES(SCHEDULE_CATEGORY_TYPE)}?${query}`
      : API_PATH.COMMON.CATEGORIES(SCHEDULE_CATEGORY_TYPE),
  );

  return response.data;
}
