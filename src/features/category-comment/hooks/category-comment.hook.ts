import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createCategoryCommentProcess,
  editCategoryCommentProcess,
  removeCategoryCommentProcess,
} from '@/features/category-comment/api/category-comment.api';
import type { CreateCategoryCommentProcessRequest } from '@/features/category-comment/types/create-category-comment-process.request';
import type { CreateCategoryCommentProcessResponse } from '@/features/category-comment/types/create-category-comment-process.response';
import type { EditCategoryCommentProcessRequest } from '@/features/category-comment/types/edit-category-comment-process.request';
import type { RemoveCategoryCommentProcessRequest } from '@/features/category-comment/types/remove-category-comment-process.request';
import { QUERY_KEY } from '@/shared/api';

export function useCreateCategoryCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCategoryCommentProcessResponse,
    Error,
    CreateCategoryCommentProcessRequest
  >({
    mutationFn: createCategoryCommentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORY_COMMENT });
    },
  });
}

export function useEditCategoryCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCategoryCommentProcessResponse,
    Error,
    EditCategoryCommentProcessRequest
  >({
    mutationFn: editCategoryCommentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORY_COMMENT });
    },
  });
}

export function useRemoveCategoryCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCategoryCommentProcessResponse,
    Error,
    RemoveCategoryCommentProcessRequest
  >({
    mutationFn: removeCategoryCommentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORY_COMMENT });
    },
  });
}
