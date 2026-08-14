import { QueryClient } from "@tanstack/react-query";

export const QUERY_KEY = {
  AUTH: {
    TOKEN_EXPIRED: ['auth', 'token-expired'] as const,
  },
  DASHBOARD: ['dashboard'] as const,
  HOTLINE: ['hotline'] as const,
  DEPARTMENTS: ['departments'] as const,
  DEPARTMENT: (id: number | string) => ['department', id] as const,
  DIVISIONS: ['divisions'] as const,
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
