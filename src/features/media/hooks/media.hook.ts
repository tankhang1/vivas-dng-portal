import { useMutation } from '@tanstack/react-query';

import {
  approvalMediaProcess,
  editMediaProcess,
  postMediaProcess,
  removeMediaProcess,
} from '@/features/media/api/media.api';
import type { ApprovalMediaProcessRequest } from '@/features/media/types/approval-media-process.request';
import type { EditMediaProcessRequest } from '@/features/media/types/edit-media-process.request';
import type { PostMediaProcessRequest } from '@/features/media/types/post-media-process.request';
import type { PostMediaProcessResponse } from '@/features/media/types/post-media-process.response';
import type { RemoveMediaProcessRequest } from '@/features/media/types/remove-media-process.request';

export function usePostMediaProcessMutation() {
  return useMutation<PostMediaProcessResponse, Error, PostMediaProcessRequest>({
    mutationFn: postMediaProcess,
  });
}

export function useEditMediaProcessMutation() {
  return useMutation<PostMediaProcessResponse, Error, EditMediaProcessRequest>({
    mutationFn: editMediaProcess,
  });
}

export function useApprovalMediaProcessMutation() {
  return useMutation<PostMediaProcessResponse, Error, ApprovalMediaProcessRequest>({
    mutationFn: approvalMediaProcess,
  });
}

export function useRemoveMediaProcessMutation() {
  return useMutation<PostMediaProcessResponse, Error, RemoveMediaProcessRequest>({
    mutationFn: removeMediaProcess,
  });
}
