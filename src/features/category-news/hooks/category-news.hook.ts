import { useMutation } from '@tanstack/react-query';

import {
  createCategoryNewsProcess,
  editCategoryNewsProcess,
  removeCategoryNewsProcess,
} from '@/features/category-news/api/category-news.api';
import type { CreateCategoryNewsProcessRequest } from '@/features/category-news/types/create-category-news-process.request';
import type { CreateCategoryNewsProcessResponse } from '@/features/category-news/types/create-category-news-process.response';
import type { EditCategoryNewsProcessRequest } from '@/features/category-news/types/edit-category-news-process.request';
import type { RemoveCategoryNewsProcessRequest } from '@/features/category-news/types/remove-category-news-process.request';

export function useCreateCategoryNewsProcessMutation() {
  return useMutation<
    CreateCategoryNewsProcessResponse,
    Error,
    CreateCategoryNewsProcessRequest
  >({
    mutationFn: createCategoryNewsProcess,
  });
}

export function useEditCategoryNewsProcessMutation() {
  return useMutation<
    CreateCategoryNewsProcessResponse,
    Error,
    EditCategoryNewsProcessRequest
  >({
    mutationFn: editCategoryNewsProcess,
  });
}

export function useRemoveCategoryNewsProcessMutation() {
  return useMutation<
    CreateCategoryNewsProcessResponse,
    Error,
    RemoveCategoryNewsProcessRequest
  >({
    mutationFn: removeCategoryNewsProcess,
  });
}
