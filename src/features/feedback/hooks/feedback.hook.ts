import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  approveFeedbackProcess,
  createFeedbackProcess,
  editFeedbackProcess,
  getFeedbackByCommentUuid,
} from '@/features/feedback/api/feedback.api';
import type { ApproveFeedbackProcessRequest } from '@/features/feedback/types/approve-feedback-process.request';
import type { CreateFeedbackProcessRequest } from '@/features/feedback/types/create-feedback-process.request';
import type { CreateFeedbackProcessResponse } from '@/features/feedback/types/create-feedback-process.response';
import type { EditFeedbackProcessRequest } from '@/features/feedback/types/edit-feedback-process.request';
import type { FeedbackDetailResponse } from '@/features/feedback/types/get-feedback.response';
import { QUERY_KEY } from '@/shared/api';

export function useCreateFeedbackProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreateFeedbackProcessResponse, Error, CreateFeedbackProcessRequest>({
    mutationFn: createFeedbackProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.COMMENTS });
    },
  });
}

export function useEditFeedbackProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreateFeedbackProcessResponse, Error, EditFeedbackProcessRequest>({
    mutationFn: editFeedbackProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.COMMENTS });
    },
  });
}

export function useApproveFeedbackProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreateFeedbackProcessResponse, Error, ApproveFeedbackProcessRequest>({
    mutationFn: approveFeedbackProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.COMMENTS });
    },
  });
}

export function useFeedbackQuery(commentUuid?: string | number) {
  return useQuery<FeedbackDetailResponse>({
    queryKey: QUERY_KEY.FEEDBACK(commentUuid ?? ''),
    queryFn: () => getFeedbackByCommentUuid(commentUuid as string | number),
    enabled: commentUuid !== undefined && commentUuid !== null && commentUuid !== '',
  });
}
