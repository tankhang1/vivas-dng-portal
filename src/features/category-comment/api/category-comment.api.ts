import { API_PATH, apiClient } from "@/shared/api";
import type { CreateCategoryCommentProcessRequest } from "@/features/category-comment/types/create-category-comment-process.request";
import type { CreateCategoryCommentProcessResponse } from "@/features/category-comment/types/create-category-comment-process.response";
import type { EditCategoryCommentProcessRequest } from "@/features/category-comment/types/edit-category-comment-process.request";
import type { RemoveCategoryCommentProcessRequest } from "@/features/category-comment/types/remove-category-comment-process.request";
import type { GetCategoriesResponse } from "@/features/category-news/types/get-categories.response";
import type { SearchCategoriesRequest } from "@/features/category-news/types/search-categories.request";

export const COMMENT_CATEGORY_TYPE = 3;

export async function getCommentCategories(
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
      ? `${API_PATH.COMMON.CATEGORIES(COMMENT_CATEGORY_TYPE)}?${query}`
      : API_PATH.COMMON.CATEGORIES(COMMENT_CATEGORY_TYPE),
  );

  return response.data;
}

export async function createCategoryCommentProcess(
  request: CreateCategoryCommentProcessRequest,
): Promise<CreateCategoryCommentProcessResponse> {
  const response = await apiClient.post<CreateCategoryCommentProcessResponse>(
    API_PATH.CATEGORY_COMMENT.CREATE_PROCESS,
    request,
  );

  return response.data;
}

export async function editCategoryCommentProcess(
  request: EditCategoryCommentProcessRequest,
): Promise<CreateCategoryCommentProcessResponse> {
  const response = await apiClient.post<CreateCategoryCommentProcessResponse>(
    API_PATH.CATEGORY_COMMENT.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function removeCategoryCommentProcess(
  request: RemoveCategoryCommentProcessRequest,
): Promise<CreateCategoryCommentProcessResponse> {
  const response = await apiClient.post<CreateCategoryCommentProcessResponse>(
    API_PATH.CATEGORY_COMMENT.REMOVE_PROCESS,
    request,
  );

  return response.data;
}
