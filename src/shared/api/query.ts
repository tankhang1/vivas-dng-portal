import { QueryClient } from "@tanstack/react-query";

export const QUERY_KEY = {
  AUTH: {
    TOKEN_EXPIRED: ['auth', 'token-expired'] as const,
  },
  DASHBOARD: ['dashboard'] as const,
  HOTLINE: ['hotline'] as const,
  CATEGORY_COMMENT: ['category-comment'] as const,
  CATEGORY_MEDIA: ['category-media'] as const,
  CATEGORY_NEWS: ['category-news'] as const,
  DEPARTMENTS: ['departments'] as const,
  DEPARTMENTS_SUB: (idRoot: number | string) => ['departments', 'sub', idRoot] as const,
  DEPARTMENT: (id: number | string) => ['department', id] as const,
  DIVISIONS: ['divisions'] as const,
  DIVISION: (id: number | string) => ['division', id] as const,
  STAFF: ['staff'] as const,
  STAFF_SEARCH: (params: { key?: string; sz?: number; nu?: number }) =>
    ['staff', 'search', params] as const,
  STAFF_BY_DEPARTMENT: (departmentId: number | string, params: { sz?: number; nu?: number }) =>
    ['staff', 'department', departmentId, params] as const,
  STAFF_COORDINATE_COMMENT: (id: number | string) =>
    ['staff', 'coordinate-comment', id] as const,
  STAFF_COORDINATE_COMMENTS_CATEGORY_APPROVE: (
    categoryId: number | string,
    params: { sz?: number; nu?: number },
  ) => ['staff', 'coordinate-comment', 'category-approve', categoryId, params] as const,
  STAFF_COORDINATE_COMMENTS_CATEGORY_NONE_APPROVE: (
    categoryId: number | string,
    params: { sz?: number; nu?: number },
  ) => ['staff', 'coordinate-comment', 'category-none-approve', categoryId, params] as const,
  STAFF_COORDINATE_COMMENTS_STAFF_APPROVE: (
    staffId: number | string,
    params: { sz?: number; nu?: number },
  ) => ['staff', 'coordinate-comment', 'staff-approve', staffId, params] as const,
  STAFF_COORDINATE_COMMENTS_STAFF_NONE_APPROVE: (
    staffId: number | string,
    params: { sz?: number; nu?: number },
  ) => ['staff', 'coordinate-comment', 'staff-none-approve', staffId, params] as const,
  NEWS: ['news'] as const,
  NEWS_DETAIL: (id: number | string) => ['news', 'detail', id] as const,
  NEWS_ALL: (params: { sz?: number; nu?: number }) => ['news', 'all', params] as const,
  NEWS_INDEX: (params: { sz?: number; nu?: number }) => ['news', 'index', params] as const,
  MEDIA: ['media'] as const,
  COMMENTS: ['comments'] as const,
  COMMENTS_SEARCH: (params: {
    key?: string;
    start?: number;
    end?: number;
    pageStart?: number;
    nu?: number;
  }) => ['comments', 'search', params] as const,
  COMMENT: (cUuid: string) => ['comments', 'detail', cUuid] as const,
  CITIZENS: ['citizens'] as const,
  CITIZENS_SEARCH: (params: {
    key?: string;
    start?: number;
    end?: number;
    sz?: number;
    nu?: number;
  }) => ['citizens', 'search', params] as const,
  NEWS_SEARCH: (params: {
    key?: string;
    category_item?: number;
    sz?: number;
    nu?: number;
  }) => ['news', 'search', params] as const,
  NEWS_CATEGORIES: (params: { sz?: number; nu?: number }) =>
    ['category-news', 'list', params] as const,
  COMMENT_CATEGORIES: (params: { sz?: number; nu?: number }) =>
    ['category-comment', 'list', params] as const,
} as const;

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        retry: 3,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export const queryClient = createAppQueryClient();
