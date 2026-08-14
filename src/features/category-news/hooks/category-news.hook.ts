import { useMutation, useQuery } from '@tanstack/react-query';

import {
  createCategoryNewsProcess,
  editCategoryNewsProcess,
  getNewsCategories,
  removeCategoryNewsProcess,
} from '@/features/category-news/api/category-news.api';
import type { CreateCategoryNewsProcessRequest } from '@/features/category-news/types/create-category-news-process.request';
import type { CreateCategoryNewsProcessResponse } from '@/features/category-news/types/create-category-news-process.response';
import type { EditCategoryNewsProcessRequest } from '@/features/category-news/types/edit-category-news-process.request';
import type { GetCategoriesResponse } from '@/features/category-news/types/get-categories.response';
import type { RemoveCategoryNewsProcessRequest } from '@/features/category-news/types/remove-category-news-process.request';
import type { SearchCategoriesRequest } from '@/features/category-news/types/search-categories.request';
import { QUERY_KEY } from '@/shared/api';

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

export function useNewsCategoriesQuery(request: SearchCategoriesRequest = {}) {
  return useQuery<GetCategoriesResponse>({
    queryKey: QUERY_KEY.NEWS_CATEGORIES(request),
    queryFn: () => getNewsCategories(request),
  });
}
