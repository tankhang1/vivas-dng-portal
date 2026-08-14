import { API_PATH, apiClient } from "@/shared/api";
import type { CreateCategoryCommentProcessRequest } from "@/features/category-comment/types/create-category-comment-process.request";
import type { CreateCategoryCommentProcessResponse } from "@/features/category-comment/types/create-category-comment-process.response";
import type { EditCategoryCommentProcessRequest } from "@/features/category-comment/types/edit-category-comment-process.request";

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
