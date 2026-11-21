import { api } from '../../lib/api';
import type { RunsParams, RunsResponse } from './types';
export async function fetchRuns(projectId: string, params: RunsParams):
Promise<RunsResponse> {
const { data } = await api.get<RunsResponse>(`/projects/${projectId}/runs`,
{ params });
return data;
}