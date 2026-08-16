import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { editDashboardProcess, getDashboard } from '@/features/dashboard/api/dashboard.api';
import type { EditDashboardProcessRequest } from '@/features/dashboard/types/edit-dashboard-process.request';
import type { EditDashboardProcessResponse } from '@/features/dashboard/types/edit-dashboard-process.response';
import type { GetDashboardResponse } from '@/features/dashboard/types/get-dashboard.response';
import { QUERY_KEY } from '@/shared/api';

export function useEditDashboardProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<EditDashboardProcessResponse, Error, EditDashboardProcessRequest>({
    mutationFn: editDashboardProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.DASHBOARD });
    },
  });
}

export function useDashboardQuery() {
  return useQuery<GetDashboardResponse>({
    queryKey: QUERY_KEY.DASHBOARD,
    queryFn: getDashboard,
  });
}
