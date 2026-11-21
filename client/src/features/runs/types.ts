export type RunStatus = 'queued' | 'in_progress' | 'success' | 'failure';
export type Run = {
_id: string;
project: string;
runNumber: number;
workflowName: string;
branch: string;
commitSha: string;
commitMessage: string;
actor: string;
status: RunStatus;
startedAt: string;
completedAt?: string;
durationMs?: number;
};
export type Pagination = {
page: number;
limit: number;
total: number;
totalPages: number;
};
export type RunsResponse = {
data: Run[];
pagination: Pagination;
};
export type RunsParams = {
page: number;
limit: number;
status?: RunStatus;
};