import { useMutation, useQuery } from '@tanstack/react-query';

import { createHotlineProcess, getHotline } from '@/features/hotline/api/hotline.api';
import type { CreateHotlineProcessRequest } from '@/features/hotline/types/create-hotline-process.request';
import type { CreateHotlineProcessResponse } from '@/features/hotline/types/create-hotline-process.response';
import type { GetHotlineResponse } from '@/features/hotline/types/get-hotline.response';
import { QUERY_KEY } from '@/shared/api';

export function useCreateHotlineProcessMutation() {
  return useMutation<CreateHotlineProcessResponse, Error, CreateHotlineProcessRequest>({
    mutationFn: createHotlineProcess,
  });
}

export function useHotlineQuery() {
  return useQuery<GetHotlineResponse>({
    queryKey: QUERY_KEY.HOTLINE,
    queryFn: getHotline,
  });
}
