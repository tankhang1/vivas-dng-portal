import { API_PATH, apiClient } from "@/shared/api";
import type { CreateCategoryMediaProcessRequest } from "@/features/category-media/types/create-category-media-process.request";
import type { CreateCategoryMediaProcessResponse } from "@/features/category-media/types/create-category-media-process.response";
import type { EditCategoryMediaProcessRequest } from "@/features/category-media/types/edit-category-media-process.request";
import type { RemoveCategoryMediaProcessRequest } from "@/features/category-media/types/remove-category-media-process.request";

export async function createCategoryMediaProcess(
  request: CreateCategoryMediaProcessRequest,
): Promise<CreateCategoryMediaProcessResponse> {
  const response = await apiClient.post<CreateCategoryMediaProcessResponse>(
    API_PATH.CATEGORY_MEDIA.CREATE_PROCESS,
    request,
  );

  return response.data;
}

export async function editCategoryMediaProcess(
  request: EditCategoryMediaProcessRequest,
): Promise<CreateCategoryMediaProcessResponse> {
  const response = await apiClient.post<CreateCategoryMediaProcessResponse>(
    API_PATH.CATEGORY_MEDIA.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function removeCategoryMediaProcess(
  request: RemoveCategoryMediaProcessRequest,
): Promise<CreateCategoryMediaProcessResponse> {
  const response = await apiClient.post<CreateCategoryMediaProcessResponse>(
    API_PATH.CATEGORY_MEDIA.REMOVE_PROCESS,
    request,
  );

  return response.data;
}
