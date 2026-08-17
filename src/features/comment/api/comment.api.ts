import { API_PATH, apiClient } from '@/shared/api';
import type { GetCitizenCommentsRequest } from '@/features/comment/types/get-citizen-comments.request';
import type { SearchCommentsRequest } from '@/features/comment/types/search-comments.request';
import type { CommentItem } from '@/features/comment/types/get-comment.response';
import type { GetCommentsResponse } from '@/features/comment/types/get-comments.response';
import type { PostCommentProcessRequest } from '@/features/comment/types/post-comment-process.request';
import type { PostCommentProcessResponse } from '@/features/comment/types/post-comment-process.response';

export async function getComments(): Promise<GetCommentsResponse> {
  const response = await apiClient.get<GetCommentsResponse>(
    API_PATH.COMMON_PORTAL.COMMENTS,
  );

  return response.data;
}

export async function searchComments(
  request: SearchCommentsRequest,
): Promise<GetCommentsResponse> {
  const params = new URLSearchParams();

  if (request.key !== undefined && request.key !== '') {
    params.append('key', request.key);
  }

  if (request.start !== undefined) {
    params.append('start', String(request.start));
  }

  if (request.end !== undefined) {
    params.append('end', String(request.end));
  }

  if (request.pageStart !== undefined) {
    params.append('start', String(request.pageStart));
  }

  if (request.sz !== undefined) {
    params.append('sz', String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append('nu', String(request.nu));
  }

  const response = await apiClient.get<GetCommentsResponse>(
    `${API_PATH.COMMON_PORTAL.COMMENTS}/search?${params.toString()}`,
  );

  return response.data;
}

export async function getCommentByUuid(cUuid: string): Promise<CommentItem> {
  const response = await apiClient.get<CommentItem>(API_PATH.COMMON_PORTAL.COMMENT(cUuid));

  return response.data;
}

export async function getCitizenComments(
  request: GetCitizenCommentsRequest,
): Promise<GetCommentsResponse> {
  const params = new URLSearchParams();

  if (request.sz !== undefined) {
    params.append('sz', String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append('nu', String(request.nu));
  }

  const query = params.toString();
  const response = await apiClient.get<GetCommentsResponse>(
    query
      ? `${API_PATH.COMMON_PORTAL.CITIZEN_COMMENTS(request.zaloUserId)}?${query}`
      : API_PATH.COMMON_PORTAL.CITIZEN_COMMENTS(request.zaloUserId),
  );

  return response.data;
}

export async function postCommentProcess(
  request: PostCommentProcessRequest,
): Promise<PostCommentProcessResponse> {
  const response = await apiClient.post<PostCommentProcessResponse>(
    API_PATH.ZALO.POST_COMMENT_PROCESS,
    request,
  );

  return response.data;
}
