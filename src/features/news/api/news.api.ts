import { API_PATH, apiClient } from "@/shared/api";
import type { ApprovalNewsProcessRequest } from "@/features/news/types/approval-news-process.request";
import type { PostNewsProcessRequest } from "@/features/news/types/post-news-process.request";
import type { PostNewsProcessResponse } from "@/features/news/types/post-news-process.response";
import type { EditNewsProcessRequest } from "@/features/news/types/edit-news-process.request";
import type { RemoveNewsProcessRequest } from "@/features/news/types/remove-news-process.request";
import type { GetNewsResponse } from "@/features/news/types/get-news.response";
import type { SearchNewsRequest } from "@/features/news/types/search-news.request";

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

export async function searchNews(
  request: SearchNewsRequest,
): Promise<GetNewsResponse> {
  const params = new URLSearchParams();

  if (request.key !== undefined && request.key !== "") {
    params.append("key", request.key);
  }

  if (request.category_item !== undefined) {
    params.append("category_item", String(request.category_item));
  }

  if (request.sz !== undefined) {
    params.append("sz", String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append("nu", String(request.nu));
  }

  const query = params.toString();
  const response = await apiClient.get<GetNewsResponse>(
    query
      ? `${API_PATH.COMMON.NEWS_PUBLIC_SEARCH}?${query}`
      : API_PATH.COMMON.NEWS_PUBLIC_SEARCH,
  );

  return response.data;
}
