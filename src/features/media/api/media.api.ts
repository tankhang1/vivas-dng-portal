import { API_PATH, apiClient } from "@/shared/api";
import type { ApprovalMediaProcessRequest } from "@/features/media/types/approval-media-process.request";
import type { ApprovalMediaProcessResponse } from "@/features/media/types/approval-media-process.response";
import type { EditMediaProcessRequest } from "@/features/media/types/edit-media-process.request";
import type { EditMediaProcessResponse } from "@/features/media/types/edit-media-process.response";
import type { PostMediaProcessRequest } from "@/features/media/types/post-media-process.request";
import type { PostMediaProcessResponse } from "@/features/media/types/post-media-process.response";
import type { RemoveMediaProcessRequest } from "@/features/media/types/remove-media-process.request";
import type { RemoveMediaProcessResponse } from "@/features/media/types/remove-media-process.response";

export async function postMediaProcess(
  request: PostMediaProcessRequest,
): Promise<PostMediaProcessResponse> {
  const response = await apiClient.post<PostMediaProcessResponse>(
    API_PATH.MEDIA.POST_PROCESS,
    request,
  );

  return response.data;
}

export async function editMediaProcess(
  request: EditMediaProcessRequest,
): Promise<EditMediaProcessResponse> {
  const response = await apiClient.post<EditMediaProcessResponse>(
    API_PATH.MEDIA.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function approvalMediaProcess(
  request: ApprovalMediaProcessRequest,
): Promise<ApprovalMediaProcessResponse> {
  const response = await apiClient.post<ApprovalMediaProcessResponse>(
    API_PATH.MEDIA.APPROVAL_PROCESS,
    request,
  );

  return response.data;
}

export async function removeMediaProcess(
  request: RemoveMediaProcessRequest,
): Promise<RemoveMediaProcessResponse> {
  const response = await apiClient.post<RemoveMediaProcessResponse>(
    API_PATH.MEDIA.REMOVE_PROCESS,
    request,
  );

  return response.data;
}
