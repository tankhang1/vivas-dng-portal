import { useMutation } from '@tanstack/react-query';

import {
  createCategoryMediaProcess,
  editCategoryMediaProcess,
  removeCategoryMediaProcess,
} from '@/features/category-media/api/category-media.api';
import type { CreateCategoryMediaProcessRequest } from '@/features/category-media/types/create-category-media-process.request';
import type { CreateCategoryMediaProcessResponse } from '@/features/category-media/types/create-category-media-process.response';
import type { EditCategoryMediaProcessRequest } from '@/features/category-media/types/edit-category-media-process.request';
import type { RemoveCategoryMediaProcessRequest } from '@/features/category-media/types/remove-category-media-process.request';

export function useCreateCategoryMediaProcessMutation() {
  return useMutation<
    CreateCategoryMediaProcessResponse,
    Error,
    CreateCategoryMediaProcessRequest
  >({
    mutationFn: createCategoryMediaProcess,
  });
}

export function useEditCategoryMediaProcessMutation() {
  return useMutation<
    CreateCategoryMediaProcessResponse,
    Error,
    EditCategoryMediaProcessRequest
  >({
    mutationFn: editCategoryMediaProcess,
  });
}

export function useRemoveCategoryMediaProcessMutation() {
  return useMutation<
    CreateCategoryMediaProcessResponse,
    Error,
    RemoveCategoryMediaProcessRequest
  >({
    mutationFn: removeCategoryMediaProcess,
  });
}
