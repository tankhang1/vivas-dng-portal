import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  approvalNewsProcess,
  editNewsProcess,
  getAllNews,
  getNewsById,
  getNewsIndex,
  postNewsProcess,
  removeNewsProcess,
  searchNews,
} from '@/features/news/api/news.api';
import type { ApprovalNewsProcessRequest } from '@/features/news/types/approval-news-process.request';
import type { ApprovalNewsProcessResponse } from '@/features/news/types/approval-news-process.response';
import type { EditNewsProcessRequest } from '@/features/news/types/edit-news-process.request';
import type { EditNewsProcessResponse } from '@/features/news/types/edit-news-process.response';
import type { GetAllNewsRequest } from '@/features/news/types/get-all-news.request';
import type { GetNewsResponse, NewsItem } from '@/features/news/types/get-news.response';
import type { PostNewsProcessRequest } from '@/features/news/types/post-news-process.request';
import type { PostNewsProcessResponse } from '@/features/news/types/post-news-process.response';
import type { RemoveNewsProcessRequest } from '@/features/news/types/remove-news-process.request';
import type { RemoveNewsProcessResponse } from '@/features/news/types/remove-news-process.response';
import type { SearchNewsRequest } from '@/features/news/types/search-news.request';
import { QUERY_KEY } from '@/shared/api';

export function useAllNewsQuery(request: GetAllNewsRequest = {}) {
  return useQuery<GetNewsResponse>({
    queryKey: QUERY_KEY.NEWS_ALL(request),
    queryFn: () => getAllNews(request),
    placeholderData: keepPreviousData,
  });
}

export function usePostNewsProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<PostNewsProcessResponse, Error, PostNewsProcessRequest>({
    mutationFn: postNewsProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.NEWS });
    },
  });
}

export function useEditNewsProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<EditNewsProcessResponse, Error, EditNewsProcessRequest>({
    mutationFn: editNewsProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.NEWS });
    },
  });
}

export function useApprovalNewsProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApprovalNewsProcessResponse,
    Error,
    ApprovalNewsProcessRequest
  >({
    mutationFn: approvalNewsProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.NEWS });
    },
  });
}

export function useRemoveNewsProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<RemoveNewsProcessResponse, Error, RemoveNewsProcessRequest>({
    mutationFn: removeNewsProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.NEWS });
    },
  });
}

export function useSearchNewsQuery(request: SearchNewsRequest) {
  return useQuery<GetNewsResponse>({
    queryKey: QUERY_KEY.NEWS_SEARCH(request),
    queryFn: () => searchNews(request),
    placeholderData: keepPreviousData,
  });
}

export function useNewsIndexQuery(request: GetAllNewsRequest = {}) {
  return useQuery<GetNewsResponse>({
    queryKey: QUERY_KEY.NEWS_INDEX(request),
    queryFn: () => getNewsIndex(request),
    placeholderData: keepPreviousData,
  });
}

export function useNewsQuery(id?: number | string) {
  return useQuery<NewsItem>({
    queryKey: id ? QUERY_KEY.NEWS_DETAIL(id) : QUERY_KEY.NEWS_DETAIL(''),
    queryFn: () => getNewsById(id as number | string),
    enabled: id !== undefined && id !== null && id !== '',
  });
}
