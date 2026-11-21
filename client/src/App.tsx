import RunsPage from './pages/RunsPage';
export default function App() {
return (
<div className="min-h-screen bg-slate-50 text-slate-900">
<header className="border-b border-slate-200 bg-white">
<div className="mx-auto flex max-w-5xl items-center px-4 py-3">
<span className="text-lg font-semibold">PipelinePulse</span>
</div>
</header>
<main className="mx-auto max-w-5xl px-4 py-6">
<RunsPage />
</main>
</div>
);
}