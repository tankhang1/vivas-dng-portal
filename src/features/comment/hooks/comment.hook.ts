import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  getCommentByUuid,
  getComments,
  searchComments,
} from '@/features/comment/api/comment.api';
import type { CommentItem } from '@/features/comment/types/get-comment.response';
import type { GetCommentsResponse } from '@/features/comment/types/get-comments.response';
import type { SearchCommentsRequest } from '@/features/comment/types/search-comments.request';
import { QUERY_KEY } from '@/shared/api';

export function useCommentsQuery() {
  return useQuery<GetCommentsResponse>({
    queryKey: QUERY_KEY.COMMENTS,
    queryFn: getComments,
  });
}

export function useSearchCommentsQuery(request: SearchCommentsRequest) {
  return useQuery<GetCommentsResponse>({
    queryKey: QUERY_KEY.COMMENTS_SEARCH(request),
    queryFn: () => searchComments(request),
    placeholderData: keepPreviousData,
  });
}

export function useCommentQuery(cUuid?: string) {
  return useQuery<CommentItem>({
    queryKey: cUuid ? QUERY_KEY.COMMENT(cUuid) : QUERY_KEY.COMMENT(''),
    queryFn: () => getCommentByUuid(cUuid as string),
    enabled: !!cUuid,
  });
}
