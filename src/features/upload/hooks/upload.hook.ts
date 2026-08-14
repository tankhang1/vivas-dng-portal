import { useMutation } from '@tanstack/react-query';

import { uploadAudio, uploadImage, uploadPdf } from '@/features/upload/api/upload.api';
import type { UploadAudioRequest } from '@/features/upload/types/upload-audio.request';
import type { UploadAudioResponse } from '@/features/upload/types/upload-audio.response';
import type { UploadImageRequest } from '@/features/upload/types/upload-image.request';
import type { UploadImageResponse } from '@/features/upload/types/upload-image.response';
import type { UploadPdfRequest } from '@/features/upload/types/upload-pdf.request';
import type { UploadPdfResponse } from '@/features/upload/types/upload-pdf.response';

export function useUploadImageMutation() {
  return useMutation<UploadImageResponse, Error, UploadImageRequest>({
    mutationFn: uploadImage,
  });
}

export function useUploadPdfMutation() {
  return useMutation<UploadPdfResponse, Error, UploadPdfRequest>({
    mutationFn: uploadPdf,
  });
}

export function useUploadAudioMutation() {
  return useMutation<UploadAudioResponse, Error, UploadAudioRequest>({
    mutationFn: uploadAudio,
  });
}
