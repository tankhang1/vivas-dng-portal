import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../api';

type QueryClientProviderProps = {
  children: ReactNode;
};

export function QueryClientProviderRoot({
  children,
}: QueryClientProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
