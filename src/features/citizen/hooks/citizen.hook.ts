import { useQuery } from '@tanstack/react-query';

import { getCitizens, searchCitizens } from '@/features/citizen/api/citizen.api';
import type { GetCitizensResponse } from '@/features/citizen/types/get-citizens.response';
import type { SearchCitizensRequest } from '@/features/citizen/types/search-citizens.request';
import { QUERY_KEY } from '@/shared/api';

export function useCitizensQuery() {
  return useQuery<GetCitizensResponse>({
    queryKey: QUERY_KEY.CITIZENS,
    queryFn: getCitizens,
  });
}

export function useSearchCitizensQuery(request: SearchCitizensRequest) {
  return useQuery<GetCitizensResponse>({
    queryKey: QUERY_KEY.CITIZENS_SEARCH(request),
    queryFn: () => searchCitizens(request),
  });
}
