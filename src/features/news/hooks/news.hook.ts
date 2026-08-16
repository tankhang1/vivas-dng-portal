import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import {
  approvalNewsProcess,
  editNewsProcess,
  postNewsProcess,
  removeNewsProcess,
  searchNews,
} from '@/features/news/api/news.api';
import type { ApprovalNewsProcessRequest } from '@/features/news/types/approval-news-process.request';
import type { ApprovalNewsProcessResponse } from '@/features/news/types/approval-news-process.response';
import type { EditNewsProcessRequest } from '@/features/news/types/edit-news-process.request';
import type { EditNewsProcessResponse } from '@/features/news/types/edit-news-process.response';
import type { GetNewsResponse } from '@/features/news/types/get-news.response';
import type { PostNewsProcessRequest } from '@/features/news/types/post-news-process.request';
import type { PostNewsProcessResponse } from '@/features/news/types/post-news-process.response';
import type { RemoveNewsProcessRequest } from '@/features/news/types/remove-news-process.request';
import type { RemoveNewsProcessResponse } from '@/features/news/types/remove-news-process.response';
import type { SearchNewsRequest } from '@/features/news/types/search-news.request';
import { QUERY_KEY } from '@/shared/api';

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
