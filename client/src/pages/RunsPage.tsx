import { useState } from 'react';
import type { ReactNode } from 'react';
import { Pagination } from '../components/Pagination';
import { useProjects } from '../features/projects/useProjects';
import { RunsTable } from '../features/runs/RunsTable';
import { useRuns } from '../features/runs/useRuns';
import type { RunStatus } from '../features/runs/types';
const PAGE_SIZE = 10;
const SELECT =
'rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm';
function Message({ children, error = false }: { children: ReactNode; error?:
boolean }) {
return (
<p className={`px-4 py-10 text-center text-sm ${error ? 'text-red-600' :
'text-slate-500'}`}>
{children}
</p>
);
}
export default function RunsPage() {
const [selectedProjectId, setSelectedProjectId] = useState<string | null>
(null);
const [status, setStatus] = useState<RunStatus | ''>('');
const [page, setPage] = useState(1);
const projects = useProjects();
const projectId = selectedProjectId ?? projects.data?.[0]?._id;
const currentProject = projects.data?.find((project) => project._id ===
projectId);
const runs = useRuns(projectId, {
page,
limit: PAGE_SIZE,
status: status || undefined,
});
const runList = runs.data?.data ?? [];
const pagination = runs.data?.pagination;
let content: ReactNode;
if (projects.isLoading || runs.isLoading) {
content = <Message>Loading runs…</Message>;
} else if (projects.isError || runs.isError) {
content = <Message error>Couldn't load data. Is the server running?
</Message>;
} else if (!projects.data?.length) {
content = <Message>No projects yet. In the server folder, run: npm run
seed</Message>;
} else if (runList.length === 0) {
content = <Message>No runs match these filters.</Message>;
} else {
content = (
<>
<RunsTable runs={runList} />
{pagination && (
<Pagination
page={pagination.page}
totalPages={pagination.totalPages}
total={pagination.total}
isFetching={runs.isFetching}
onPageChange={setPage}
/>
)}
</>
);
}
return (
<section className="rounded-xl border border-slate-200 bg-white shadowsm">
<div className="flex flex-wrap items-center justify-between gap-3
border-b border-slate-200 px-4 py-3">
<div>
    <h1 className="text-base font-semibold">Pipeline runs</h1>
<p className="text-xs text-slate-500">
{currentProject?.repoFullName}</p>
</div>
<div className="flex gap-2">
{projects.data && projects.data.length > 1 && (
<select
className={SELECT}
value={projectId ?? ''}
onChange={(event) => {
setSelectedProjectId(event.target.value);
setPage(1);
}}
>
{projects.data.map((project) => (
<option key={project._id} value={project._id}>
{project.name}
</option>
))}
</select>
)}
<select
className={SELECT}
value={status}
onChange={(event) => {
setStatus(event.target.value as RunStatus | '');
setPage(1);
}}
>
<option value="">All statuses</option>
<option value="success">Success</option>
<option value="failure">Failed</option>
<option value="in_progress">Running</option>
<option value="queued">Queued</option>
</select>
</div>
</div>
{content}
</section>
);
}