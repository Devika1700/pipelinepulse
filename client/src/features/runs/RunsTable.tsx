import { StatusBadge } from '../../components/StatusBadge';
import { formatDuration, timeAgo } from '../../lib/format';
import type { Run } from './types';
const HEADERS = ['Status', 'Workflow', 'Branch', 'Commit', 'Author',
'Duration', 'Started'];
export function RunsTable({ runs }: { runs: Run[] }) {
return (
<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead>
<tr className="border-b border-slate-200 text-left text-xs
uppercase tracking-wide text-slate-500">
{HEADERS.map((header) => (
<th key={header} className="px-4 py-3 font-medium">
{header}
</th>
))}
</tr>
</thead>
<tbody className="divide-y divide-slate-100">
{runs.map((run) => (
<tr key={run._id} className="hover:bg-slate-50">
<td className="px-4 py-3">
<StatusBadge status={run.status} />
</td>
<td className="px-4 py-3">
<div className="font-medium">{run.workflowName}</div>
<div className="text-xs text-slate-500">
#{run.runNumber} · {run.commitMessage}
</div>
</td>
<td className="px-4 py-3 font-mono text-xs">{run.branch}</td>
<td className="px-4 py-3 font-mono text-xs text-slate-500">
{run.commitSha.slice(0, 7)}
</td>
<td className="px-4 py-3">{run.actor}</td>
<td className="px-4 py-3 tabular-nums">
{formatDuration(run.durationMs)}</td>
<td
className="px-4 py-3 text-slate-500"
title={new Date(run.startedAt).toLocaleString()}
>
{timeAgo(run.startedAt)}
</td>
</tr>
))}
</tbody>
</table>
</div>
);
}