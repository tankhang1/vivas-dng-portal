import { API_PATH, apiClient } from "@/shared/api";
import type { UploadAudioRequest } from "@/features/upload/types/upload-audio.request";
import type { UploadAudioResponse } from "@/features/upload/types/upload-audio.response";
import type { UploadImageRequest } from "@/features/upload/types/upload-image.request";
import type { UploadImageResponse } from "@/features/upload/types/upload-image.response";
import type { UploadPdfRequest } from "@/features/upload/types/upload-pdf.request";
import type { UploadPdfResponse } from "@/features/upload/types/upload-pdf.response";

export async function uploadImage(
  request: UploadImageRequest,
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('c', request.c);

  const response = await apiClient.post<UploadImageResponse>(
    API_PATH.UPLOAD.IMAGE,
    formData,
  );

  return response.data;
}

export async function uploadPdf(
  request: UploadPdfRequest,
): Promise<UploadPdfResponse> {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('c', request.c);

  const response = await apiClient.post<UploadPdfResponse>(
    API_PATH.UPLOAD.PDF,
    formData,
  );

  return response.data;
}

export async function uploadAudio(
  request: UploadAudioRequest,
): Promise<UploadAudioResponse> {
  const formData = new FormData();
  formData.append('file', request.file);
  formData.append('c', request.c);

  const response = await apiClient.post<UploadAudioResponse>(
    API_PATH.UPLOAD.AUDIO,
    formData,
  );

  return response.data;
}
