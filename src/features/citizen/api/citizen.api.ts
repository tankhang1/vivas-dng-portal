import { API_PATH, apiClient } from '@/shared/api';
import type { GetCitizensResponse } from '@/features/citizen/types/get-citizens.response';
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
