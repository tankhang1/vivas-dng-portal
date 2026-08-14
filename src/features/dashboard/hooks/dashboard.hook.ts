import { useQuery } from '@tanstack/react-query';

import { getDashboard } from '@/features/dashboard/api/dashboard.api';
import type { GetDashboardResponse } from '@/features/dashboard/types/get-dashboard.response';
import { QUERY_KEY } from '@/shared/api';

export function useDashboardQuery() {
  return useQuery<GetDashboardResponse>({
    queryKey: QUERY_KEY.DASHBOARD,
    queryFn: getDashboard,
  });
}
