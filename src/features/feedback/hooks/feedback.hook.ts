import { useMutation } from '@tanstack/react-query';

import {
  approveFeedbackProcess,
  createFeedbackProcess,
  editFeedbackProcess,
} from '@/features/feedback/api/feedback.api';
import type { ApproveFeedbackProcessRequest } from '@/features/feedback/types/approve-feedback-process.request';
import type { CreateFeedbackProcessRequest } from '@/features/feedback/types/create-feedback-process.request';
import type { CreateFeedbackProcessResponse } from '@/features/feedback/types/create-feedback-process.response';
import type { EditFeedbackProcessRequest } from '@/features/feedback/types/edit-feedback-process.request';

export function useCreateFeedbackProcessMutation() {
  return useMutation<CreateFeedbackProcessResponse, Error, CreateFeedbackProcessRequest>({
    mutationFn: createFeedbackProcess,
  });
}

export function useEditFeedbackProcessMutation() {
  return useMutation<CreateFeedbackProcessResponse, Error, EditFeedbackProcessRequest>({
    mutationFn: editFeedbackProcess,
  });
}

export function useApproveFeedbackProcessMutation() {
  return useMutation<CreateFeedbackProcessResponse, Error, ApproveFeedbackProcessRequest>({
    mutationFn: approveFeedbackProcess,
  });
}
