import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  approvalMediaProcess,
  editMediaProcess,
  postMediaProcess,
  removeMediaProcess,
} from '@/features/media/api/media.api';
import type { ApprovalMediaProcessRequest } from '@/features/media/types/approval-media-process.request';
import type { ApprovalMediaProcessResponse } from '@/features/media/types/approval-media-process.response';
import type { EditMediaProcessRequest } from '@/features/media/types/edit-media-process.request';
import type { EditMediaProcessResponse } from '@/features/media/types/edit-media-process.response';
import type { PostMediaProcessRequest } from '@/features/media/types/post-media-process.request';
import type { PostMediaProcessResponse } from '@/features/media/types/post-media-process.response';
import type { RemoveMediaProcessRequest } from '@/features/media/types/remove-media-process.request';
import type { RemoveMediaProcessResponse } from '@/features/media/types/remove-media-process.response';
import { QUERY_KEY } from '@/shared/api';

export function usePostMediaProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<PostMediaProcessResponse, Error, PostMediaProcessRequest>({
    mutationFn: postMediaProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.MEDIA });
    },
  });
}

export function useEditMediaProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<EditMediaProcessResponse, Error, EditMediaProcessRequest>({
    mutationFn: editMediaProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.MEDIA });
    },
  });
}

export function useApprovalMediaProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApprovalMediaProcessResponse,
    Error,
    ApprovalMediaProcessRequest
  >({
    mutationFn: approvalMediaProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.MEDIA });
    },
  });
}

export function useRemoveMediaProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<RemoveMediaProcessResponse, Error, RemoveMediaProcessRequest>({
    mutationFn: removeMediaProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.MEDIA });
    },
  });
}
