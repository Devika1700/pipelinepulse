import { useQuery } from '@tanstack/react-query';
import { api } from './lib/api';
type Health = { status: string; db: string; uptime: number };
export default function App() {
const { data, isLoading, isError } = useQuery({
queryKey: ['health'],
queryFn: async () => (await api.get<Health>('/health')).data,
refetchInterval: 5000,
});
return (
<main className="min-h-screen bg-slate-50 flex items-center justifycenter">
<div className="bg-white border border-slate-200 rounded-xl p-6 w-80
shadow-sm">
<h1 className="text-lg font-semibold text-slate-900 mb4">PipelinePulse</h1>
{isLoading && <p className="text-slate-500">Checking API…</p>}
{isError && <p className="text-red-600">Can't reach the API. Is the
server running?</p>}
{data && (
<dl className="space-y-2 text-sm">
<div className="flex justify-between">
<dt className="text-slate-500">API status</dt>
<dd className="font-medium text-green-700">{data.status}</dd>
</div>
<div className="flex justify-between">
<dt className="text-slate-500">Database</dt>
<dd className="font-medium text-green-700">{data.db}</dd>
</div>
<div className="flex justify-between">
<dt className="text-slate-500">Uptime</dt>
<dd className="font-medium">{data.uptime}s</dd>
</div>
</dl>
)}
</div>
</main>
);
}