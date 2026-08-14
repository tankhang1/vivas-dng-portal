import { API_PATH, apiClient } from "@/shared/api";
import type { ApproveFeedbackProcessRequest } from "@/features/feedback/types/approve-feedback-process.request";
import type { CreateFeedbackProcessRequest } from "@/features/feedback/types/create-feedback-process.request";
import type { CreateFeedbackProcessResponse } from "@/features/feedback/types/create-feedback-process.response";
import type { EditFeedbackProcessRequest } from "@/features/feedback/types/edit-feedback-process.request";

export async function createFeedbackProcess(
  request: CreateFeedbackProcessRequest,
): Promise<CreateFeedbackProcessResponse> {
  const response = await apiClient.post<CreateFeedbackProcessResponse>(
    API_PATH.FEEDBACK.CREATE_PROCESS,
    request,
  );

  return response.data;
}

export async function editFeedbackProcess(
  request: EditFeedbackProcessRequest,
): Promise<CreateFeedbackProcessResponse> {
  const response = await apiClient.post<CreateFeedbackProcessResponse>(
    API_PATH.FEEDBACK.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function approveFeedbackProcess(
  request: ApproveFeedbackProcessRequest,
): Promise<CreateFeedbackProcessResponse> {
  const response = await apiClient.post<CreateFeedbackProcessResponse>(
    API_PATH.FEEDBACK.APPROVE_PROCESS,
    request,
  );

  return response.data;
}
