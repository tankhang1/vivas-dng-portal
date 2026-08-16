import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createHotlineProcess,
  getHotline,
  removeHotlineProcess,
} from '@/features/hotline/api/hotline.api';
import type { CreateHotlineProcessRequest } from '@/features/hotline/types/create-hotline-process.request';
import type { CreateHotlineProcessResponse } from '@/features/hotline/types/create-hotline-process.response';
import type { GetHotlineResponse } from '@/features/hotline/types/get-hotline.response';
import type { RemoveHotlineProcessRequest } from '@/features/hotline/types/remove-hotline-process.request';
import type { RemoveHotlineProcessResponse } from '@/features/hotline/types/remove-hotline-process.response';
import { QUERY_KEY } from '@/shared/api';

export function useCreateHotlineProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<CreateHotlineProcessResponse, Error, CreateHotlineProcessRequest>({
    mutationFn: createHotlineProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.HOTLINE });
    },
  });
}

export function useHotlineQuery() {
  return useQuery<GetHotlineResponse>({
    queryKey: QUERY_KEY.HOTLINE,
    queryFn: getHotline,
  });
}

export function useRemoveHotlineProcessMutation() {
  const queryClient = useQueryClient();

  return useMutation<RemoveHotlineProcessResponse, Error, RemoveHotlineProcessRequest>({
    mutationFn: removeHotlineProcess,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY.HOTLINE });
    },
  });
}
