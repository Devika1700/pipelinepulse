import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchRuns } from './api';
import type { RunsParams } from './types';
export function useRuns(projectId: string | undefined, params: RunsParams) {
return useQuery({
queryKey: ['runs', projectId, params],
queryFn: () => fetchRuns(projectId!, params),
enabled: Boolean(projectId),
placeholderData: keepPreviousData,
});
}