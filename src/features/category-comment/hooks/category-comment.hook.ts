import { useMutation } from '@tanstack/react-query';

import {
  createCategoryCommentProcess,
  editCategoryCommentProcess,
  removeCategoryCommentProcess,
} from '@/features/category-comment/api/category-comment.api';
import type { CreateCategoryCommentProcessRequest } from '@/features/category-comment/types/create-category-comment-process.request';
import type { CreateCategoryCommentProcessResponse } from '@/features/category-comment/types/create-category-comment-process.response';
import type { EditCategoryCommentProcessRequest } from '@/features/category-comment/types/edit-category-comment-process.request';
import type { RemoveCategoryCommentProcessRequest } from '@/features/category-comment/types/remove-category-comment-process.request';

export function useCreateCategoryCommentProcessMutation() {
  return useMutation<
    CreateCategoryCommentProcessResponse,
    Error,
    CreateCategoryCommentProcessRequest
  >({
    mutationFn: createCategoryCommentProcess,
  });
}

export function useEditCategoryCommentProcessMutation() {
  return useMutation<
    CreateCategoryCommentProcessResponse,
    Error,
    EditCategoryCommentProcessRequest
  >({
    mutationFn: editCategoryCommentProcess,
  });
}

export function useRemoveCategoryCommentProcessMutation() {
  return useMutation<
    CreateCategoryCommentProcessResponse,
    Error,
    RemoveCategoryCommentProcessRequest
  >({
    mutationFn: removeCategoryCommentProcess,
  });
}
