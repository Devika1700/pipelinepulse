import { Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';
export function AppLayout() {
const { user, logout } = useAuth();
return (
<div className="min-h-screen bg-slate-50 text-slate-900">
<header className="border-b border-slate-200 bg-white">
<div className="mx-auto flex max-w-5xl items-center justify-between
px-4 py-3">
<span className="text-lg font-semibold">PipelinePulse</span>
<div className="flex items-center gap-3 text-sm">
<span className="text-slate-500">{user?.name}</span>
<button
className="rounded-md border border-slate-300 bg-white px-3 py1.5 font-medium hover:bg-slate-50"
onClick={() => void logout()}
>
Sign out
</button>
</div>
</div>
</header>
<main className="mx-auto max-w-5xl px-4 py-6">
<Outlet />
</main>
</div>
);
}