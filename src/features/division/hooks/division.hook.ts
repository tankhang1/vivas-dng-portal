import { useMutation, useQuery } from '@tanstack/react-query';

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
import { QUERY_KEY } from '@/shared/api';

export function useCreateDivisionProcessMutation() {
  return useMutation<
    CreateDivisionProcessResponse,
    Error,
    CreateDivisionProcessRequest
  >({
    mutationFn: createDivisionProcess,
  });
}

export function useEditDivisionProcessMutation() {
  return useMutation<
    CreateDivisionProcessResponse,
    Error,
    EditDivisionProcessRequest
  >({
    mutationFn: editDivisionProcess,
  });
}

export function useRemoveDivisionProcessMutation() {
  return useMutation<
    CreateDivisionProcessResponse,
    Error,
    RemoveDivisionProcessRequest
  >({
    mutationFn: removeDivisionProcess,
  });
}

export function useDivisionsQuery() {
  return useQuery<GetDivisionsResponse>({
    queryKey: QUERY_KEY.DIVISIONS,
    queryFn: getDivisions,
  });
}
