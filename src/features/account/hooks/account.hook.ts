import { useMutation } from "@tanstack/react-query";

import { updatePasswordProcess } from "@/features/account/api/account.api";
import type { UpdatePasswordProcessRequest } from "@/features/account/types/update-password-process.request";
import type { UpdatePasswordProcessResponse } from "@/features/account/types/update-password-process.response";

export function useUpdatePasswordProcessMutation() {
  return useMutation<
    UpdatePasswordProcessResponse,
    Error,
    UpdatePasswordProcessRequest
  >({
    mutationFn: updatePasswordProcess,
  });
}
