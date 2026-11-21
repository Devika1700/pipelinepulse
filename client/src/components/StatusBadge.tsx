import type { RunStatus } from '../features/runs/types';
const STYLES: Record<RunStatus, { label: string; className: string }> = {
success: { label: 'Success', className: 'bg-green-100 text-green-800' },
failure: { label: 'Failed', className: 'bg-red-100 text-red-800' },
in_progress: { label: 'Running', className: 'bg-blue-100 text-blue-800' },
queued: { label: 'Queued', className: 'bg-slate-100 text-slate-700' },
};
export function StatusBadge({ status }: { status: RunStatus }) {
const { label, className } = STYLES[status];
return (
<span
className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
text-xs font-medium ${className}`}
>
<span className="h-1.5 w-1.5 rounded-full bg-current" />
{label}
</span>
);
}