import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import {
  approvalNewsProcess,
  editNewsProcess,
  postNewsProcess,
  removeNewsProcess,
  searchNews,
} from '@/features/news/api/news.api';
import type { ApprovalNewsProcessRequest } from '@/features/news/types/approval-news-process.request';
import type { EditNewsProcessRequest } from '@/features/news/types/edit-news-process.request';
import type { GetNewsResponse } from '@/features/news/types/get-news.response';
import type { PostNewsProcessRequest } from '@/features/news/types/post-news-process.request';
import type { PostNewsProcessResponse } from '@/features/news/types/post-news-process.response';
import type { RemoveNewsProcessRequest } from '@/features/news/types/remove-news-process.request';
import type { SearchNewsRequest } from '@/features/news/types/search-news.request';
import { QUERY_KEY } from '@/shared/api';

export function usePostNewsProcessMutation() {
  return useMutation<PostNewsProcessResponse, Error, PostNewsProcessRequest>({
    mutationFn: postNewsProcess,
  });
}

export function useEditNewsProcessMutation() {
  return useMutation<PostNewsProcessResponse, Error, EditNewsProcessRequest>({
    mutationFn: editNewsProcess,
  });
}

export function useApprovalNewsProcessMutation() {
  return useMutation<PostNewsProcessResponse, Error, ApprovalNewsProcessRequest>({
    mutationFn: approvalNewsProcess,
  });
}

export function useRemoveNewsProcessMutation() {
  return useMutation<PostNewsProcessResponse, Error, RemoveNewsProcessRequest>({
    mutationFn: removeNewsProcess,
  });
}

export function useSearchNewsQuery(request: SearchNewsRequest) {
  return useQuery<GetNewsResponse>({
    queryKey: QUERY_KEY.NEWS_SEARCH(request),
    queryFn: () => searchNews(request),
    placeholderData: keepPreviousData,
  });
}
