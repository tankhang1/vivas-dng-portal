import { API_PATH, apiClient } from "@/shared/api";
import type { CreateCategoryNewsProcessRequest } from "@/features/category-news/types/create-category-news-process.request";
import type { CreateCategoryNewsProcessResponse } from "@/features/category-news/types/create-category-news-process.response";
import type { EditCategoryNewsProcessRequest } from "@/features/category-news/types/edit-category-news-process.request";
import type { RemoveCategoryNewsProcessRequest } from "@/features/category-news/types/remove-category-news-process.request";
import type { GetCategoriesResponse } from "@/features/category-news/types/get-categories.response";
import type { SearchCategoriesRequest } from "@/features/category-news/types/search-categories.request";

export const NEWS_CATEGORY_TYPE = 1;

export async function createCategoryNewsProcess(
  request: CreateCategoryNewsProcessRequest,
): Promise<CreateCategoryNewsProcessResponse> {
  const response = await apiClient.post<CreateCategoryNewsProcessResponse>(
    API_PATH.CATEGORY_NEWS.CREATE_PROCESS,
    request,
  );

  return response.data;
}

export async function editCategoryNewsProcess(
  request: EditCategoryNewsProcessRequest,
): Promise<CreateCategoryNewsProcessResponse> {
  const response = await apiClient.post<CreateCategoryNewsProcessResponse>(
    API_PATH.CATEGORY_NEWS.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function removeCategoryNewsProcess(
  request: RemoveCategoryNewsProcessRequest,
): Promise<CreateCategoryNewsProcessResponse> {
  const response = await apiClient.post<CreateCategoryNewsProcessResponse>(
    API_PATH.CATEGORY_NEWS.REMOVE_PROCESS,
    request,
  );

  return response.data;
}

export async function getNewsCategories(
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
      ? `${API_PATH.COMMON.CATEGORIES(NEWS_CATEGORY_TYPE)}?${query}`
      : API_PATH.COMMON.CATEGORIES(NEWS_CATEGORY_TYPE),
  );

  return response.data;
}
