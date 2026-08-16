import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createCategoryMediaProcess,
  editCategoryMediaProcess,
  removeCategoryMediaProcess,
} from '@/features/category-media/api/category-media.api';
import type { CreateCategoryMediaProcessRequest } from '@/features/category-media/types/create-category-media-process.request';
import type { CreateCategoryMediaProcessResponse } from '@/features/category-media/types/create-category-media-process.response';
import type { EditCategoryMediaProcessRequest } from '@/features/category-media/types/edit-category-media-process.request';
import type { RemoveCategoryMediaProcessRequest } from '@/features/category-media/types/remove-category-media-process.request';
import { QUERY_KEY } from '@/shared/api';

export function useCreateCategoryMediaProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCategoryMediaProcessResponse,
    Error,
    CreateCategoryMediaProcessRequest
  >({
    mutationFn: createCategoryMediaProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORY_MEDIA });
    },
  });
}

export function useEditCategoryMediaProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCategoryMediaProcessResponse,
    Error,
    EditCategoryMediaProcessRequest
  >({
    mutationFn: editCategoryMediaProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORY_MEDIA });
    },
  });
}

export function useRemoveCategoryMediaProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateCategoryMediaProcessResponse,
    Error,
    RemoveCategoryMediaProcessRequest
  >({
    mutationFn: removeCategoryMediaProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.CATEGORY_MEDIA });
    },
  });
}
