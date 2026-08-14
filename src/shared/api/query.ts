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
