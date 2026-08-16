import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDivisionProcess,
  getDivisions,
  editDivisionProcess,
  removeDivisionProcess,
} from '@/features/division/api/division.api';
import type { CreateDivisionProcessRequest } from '@/features/division/types/create-division-process.request';
import type { CreateDivisionProcessResponse } from '@/features/division/types/create-division-process.response';
import type { GetDivisionsResponse } from '@/features/division/types/get-divisions.response';
import type { EditDivisionProcessRequest } from '@/features/division/types/edit-division-process.request';
import type { RemoveDivisionProcessRequest } from '@/features/division/types/remove-division-process.request';
import type { RemoveDivisionProcessResponse } from '@/features/division/types/remove-division-process.response';
import { QUERY_KEY } from '@/shared/api';

export function useCreateDivisionProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateDivisionProcessResponse,
    Error,
    CreateDivisionProcessRequest
  >({
    mutationFn: createDivisionProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.DIVISIONS });
    },
  });
}

export function useEditDivisionProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    CreateDivisionProcessResponse,
    Error,
    EditDivisionProcessRequest
  >({
    mutationFn: editDivisionProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.DIVISIONS });
    },
  });
}

export function useRemoveDivisionProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    RemoveDivisionProcessResponse,
    Error,
    RemoveDivisionProcessRequest
  >({
    mutationFn: removeDivisionProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.DIVISIONS });
    },
  });
}

export function useDivisionsQuery() {
  return useQuery<GetDivisionsResponse>({
    queryKey: QUERY_KEY.DIVISIONS,
    queryFn: getDivisions,
  });
}
