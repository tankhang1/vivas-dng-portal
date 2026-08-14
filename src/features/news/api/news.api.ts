import { API_PATH, apiClient } from "@/shared/api";
import type { ApprovalNewsProcessRequest } from "@/features/news/types/approval-news-process.request";
import type { PostNewsProcessRequest } from "@/features/news/types/post-news-process.request";
import type { PostNewsProcessResponse } from "@/features/news/types/post-news-process.response";
import type { EditNewsProcessRequest } from "@/features/news/types/edit-news-process.request";
import type { RemoveNewsProcessRequest } from "@/features/news/types/remove-news-process.request";

export async function postNewsProcess(
  request: PostNewsProcessRequest,
): Promise<PostNewsProcessResponse> {
  const response = await apiClient.post<PostNewsProcessResponse>(
    API_PATH.NEWS.POST_PROCESS,
    request,
  );

  return response.data;
}

export async function editNewsProcess(
  request: EditNewsProcessRequest,
): Promise<PostNewsProcessResponse> {
  const response = await apiClient.post<PostNewsProcessResponse>(
    API_PATH.NEWS.EDIT_PROCESS,
    request,
  );

  return response.data;
}

export async function approvalNewsProcess(
  request: ApprovalNewsProcessRequest,
): Promise<PostNewsProcessResponse> {
  const response = await apiClient.post<PostNewsProcessResponse>(
    API_PATH.NEWS.APPROVAL_PROCESS,
    request,
  );

  return response.data;
}

export async function removeNewsProcess(
  request: RemoveNewsProcessRequest,
): Promise<PostNewsProcessResponse> {
  const response = await apiClient.post<PostNewsProcessResponse>(
    API_PATH.NEWS.REMOVE_PROCESS,
    request,
  );

  return response.data;
}
