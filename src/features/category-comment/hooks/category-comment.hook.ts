import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCategoryCommentProcess,
  editCategoryCommentProcess,
  getCommentCategories,
  removeCategoryCommentProcess,
} from '@/features/category-comment/api/category-comment.api';
import type { CreateCategoryCommentProcessRequest } from '@/features/category-comment/types/create-category-comment-process.request';
import type { CreateCategoryCommentProcessResponse } from '@/features/category-comment/types/create-category-comment-process.response';
import type { EditCategoryCommentProcessRequest } from '@/features/category-comment/types/edit-category-comment-process.request';
import type { RemoveCategoryCommentProcessRequest } from '@/features/category-comment/types/remove-category-comment-process.request';
import type { GetCategoriesResponse } from '@/features/category-news/types/get-categories.response';
import type { SearchCategoriesRequest } from '@/features/category-news/types/search-categories.request';
import { QUERY_KEY } from '@/shared/api';

export function useCommentCategoriesQuery(request: SearchCategoriesRequest = {}) {
  return useQuery<GetCategoriesResponse>({
    queryKey: QUERY_KEY.COMMENT_CATEGORIES(request),
    queryFn: () => getCommentCategories(request),
  });
}

export function useCreateCategoryCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCategoryCommentProcessResponse,
    Error,
    CreateCategoryCommentProcessRequest
  >({
    mutationFn: createCategoryCommentProcess,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORY_COMMENT }),
        queryClient.invalidateQueries({ queryKey: ['category-comment', 'list'] }),
      ]);
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORY_COMMENT }),
        queryClient.invalidateQueries({ queryKey: ['category-comment', 'list'] }),
      ]);
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
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORY_COMMENT }),
        queryClient.invalidateQueries({ queryKey: ['category-comment', 'list'] }),
      ]);
    },
  });
}
