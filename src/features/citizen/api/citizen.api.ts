import { API_PATH, apiClient } from '@/shared/api';
import type { GetCitizenProfileResponse } from '@/features/citizen/types/get-citizen-profile.response';
import type { GetCitizensResponse } from '@/features/citizen/types/get-citizens.response';
import type { EditCitizenProcessRequest } from '@/features/citizen/types/edit-citizen-process.request';
import type { EditCitizenProcessResponse } from '@/features/citizen/types/edit-citizen-process.response';
import type { SearchCitizensRequest } from '@/features/citizen/types/search-citizens.request';

export async function getCitizens(): Promise<GetCitizensResponse> {
  const response = await apiClient.get<GetCitizensResponse>(
    API_PATH.COMMON_PORTAL.CITIZEN,
  );

  return response.data;
}

export async function searchCitizens(
  request: SearchCitizensRequest,
): Promise<GetCitizensResponse> {
  const params = new URLSearchParams();

  if (request.key !== undefined && request.key !== '') {
    params.append('key', request.key);
  }

  if (request.start !== undefined) {
    params.append('start', String(request.start));
  }

  if (request.end !== undefined) {
    params.append('end', String(request.end));
  }

  if (request.sz !== undefined) {
    params.append('sz', String(request.sz));
  }

  if (request.nu !== undefined) {
    params.append('nu', String(request.nu));
  }

  const query = params.toString();
  const response = await apiClient.get<GetCitizensResponse>(
    query
      ? `${API_PATH.COMMON_PORTAL.CITIZEN}/search?${query}`
      : `${API_PATH.COMMON_PORTAL.CITIZEN}/search`,
  );

  return response.data;
}

export async function getCitizenProfile(
  zaloUserId: number | string,
): Promise<GetCitizenProfileResponse> {
  const response = await apiClient.get<GetCitizenProfileResponse>(
    API_PATH.COMMON_PORTAL.CITIZEN_PROFILE(zaloUserId),
  );

  return response.data;
}

export async function editCitizenProcess(
  request: EditCitizenProcessRequest,
): Promise<EditCitizenProcessResponse> {
  const response = await apiClient.post<EditCitizenProcessResponse>(
    API_PATH.CITIZEN.EDIT_PROCESS,
    request,
  );

  return response.data;
}
