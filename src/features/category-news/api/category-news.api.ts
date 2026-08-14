import { API_PATH, apiClient } from "@/shared/api";
import type { CreateCategoryNewsProcessRequest } from "@/features/category-news/types/create-category-news-process.request";
import type { CreateCategoryNewsProcessResponse } from "@/features/category-news/types/create-category-news-process.response";
import type { EditCategoryNewsProcessRequest } from "@/features/category-news/types/edit-category-news-process.request";
import type { RemoveCategoryNewsProcessRequest } from "@/features/category-news/types/remove-category-news-process.request";

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
