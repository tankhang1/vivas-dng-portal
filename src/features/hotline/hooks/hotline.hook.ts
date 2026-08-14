import { useMutation } from '@tanstack/react-query';

import { createHotlineProcess } from '@/features/hotline/api/hotline.api';
import type { CreateHotlineProcessRequest } from '@/features/hotline/types/create-hotline-process.request';
import type { CreateHotlineProcessResponse } from '@/features/hotline/types/create-hotline-process.response';

export function useCreateHotlineProcessMutation() {
  return useMutation<CreateHotlineProcessResponse, Error, CreateHotlineProcessRequest>({
    mutationFn: createHotlineProcess,
  });
}
