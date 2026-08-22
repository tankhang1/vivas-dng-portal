import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';

import {
  getCitizenComments,
  getCommentsByCategory,
  getCommentByUuid,
  getComments,
  postCommentProcess,
  searchComments,
  searchCommentsByStaffApprove,
} from '@/features/comment/api/comment.api';
import type { GetCommentsByCategoryRequest } from '@/features/comment/types/get-comments-by-category.request';
import type { GetCitizenCommentsRequest } from '@/features/comment/types/get-citizen-comments.request';
import type { CommentItem } from '@/features/comment/types/get-comment.response';
import type { GetCommentsResponse } from '@/features/comment/types/get-comments.response';
import type { PostCommentProcessRequest } from '@/features/comment/types/post-comment-process.request';
import type { PostCommentProcessResponse } from '@/features/comment/types/post-comment-process.response';
import type { SearchCommentsByStaffApproveRequest } from '@/features/comment/types/search-comments-by-staff-approve.request';
import type { SearchCommentsRequest } from '@/features/comment/types/search-comments.request';
import { QUERY_KEY } from '@/shared/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCommentsQuery() {
  return useQuery<GetCommentsResponse>({
    queryKey: QUERY_KEY.COMMENTS,
    queryFn: getComments,
  });
}

export function useCommentsByCategoryQuery(
  request: GetCommentsByCategoryRequest,
  enabled = true,
) {
  const { categoryId, sz, nu } = request;

  return useQuery<GetCommentsResponse>({
    queryKey: QUERY_KEY.COMMENTS_BY_CATEGORY(categoryId, { sz, nu }),
    queryFn: () => getCommentsByCategory(request),
    placeholderData: keepPreviousData,
    enabled:
      enabled &&
      categoryId !== undefined &&
      categoryId !== null &&
      categoryId !== '',
  });
}

export function useInfiniteCommentsByCategoryQuery(
  request: Omit<GetCommentsByCategoryRequest, 'nu'>,
  enabled = true,
) {
  const { categoryId, sz } = request;

  return useInfiniteQuery<GetCommentsResponse>({
    queryKey: QUERY_KEY.COMMENTS_BY_CATEGORY(categoryId, { sz }),
    queryFn: ({ pageParam }) =>
      getCommentsByCategory({ ...request, nu: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page.number + 1;
      return nextPage < lastPage.page.totalPages ? nextPage : undefined;
    },
    enabled:
      enabled &&
      categoryId !== undefined &&
      categoryId !== null &&
      categoryId !== '',
  });
}

export function useSearchCommentsQuery(
  request: SearchCommentsRequest,
  enabled = true,
) {
  return useQuery<GetCommentsResponse>({
    queryKey: QUERY_KEY.COMMENTS_SEARCH(request),
    queryFn: () => searchComments(request),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useSearchCommentsByStaffApproveQuery(
  request: SearchCommentsByStaffApproveRequest,
  enabled = true,
) {
  const { staffId, key, category_item, start, end, nu } = request;

  return useQuery<GetCommentsResponse>({
    queryKey: QUERY_KEY.COMMENTS_STAFF_APPROVE_SEARCH(staffId, {
      key,
      category_item,
      start,
      end,
      nu,
    }),
    queryFn: () => searchCommentsByStaffApprove(request),
    placeholderData: keepPreviousData,
    enabled:
      enabled &&
      staffId !== undefined &&
      staffId !== null &&
      staffId !== '',
  });
}

export function useCommentQuery(cUuid?: string) {
  return useQuery<CommentItem>({
    queryKey: cUuid ? QUERY_KEY.COMMENT(cUuid) : QUERY_KEY.COMMENT(''),
    queryFn: () => getCommentByUuid(cUuid as string),
    enabled: !!cUuid,
  });
}

export function useCitizenCommentsQuery(request: GetCitizenCommentsRequest) {
  const { zaloUserId, sz, nu } = request;

  return useQuery<GetCommentsResponse>({
    queryKey: QUERY_KEY.CITIZEN_COMMENTS(zaloUserId, { sz, nu }),
    queryFn: () => getCitizenComments(request),
    enabled:
      zaloUserId !== undefined && zaloUserId !== null && zaloUserId !== '',
  });
}

export function usePostCommentProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<PostCommentProcessResponse, Error, PostCommentProcessRequest>({
    mutationFn: postCommentProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.COMMENTS });
    },
  });
}
