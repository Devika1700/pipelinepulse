type PaginationProps = {
page: number;
totalPages: number;
total: number;
isFetching: boolean;
onPageChange: (page: number) => void;
};
const BUTTON =
'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm fontmedium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';
export function Pagination({ page, totalPages, total, isFetching,
onPageChange }: PaginationProps) {
return (
<div className="flex items-center justify-between border-t border-slate200 px-4 py-3 text-sm">
<span className="text-slate-500">
Page {page} of {Math.max(totalPages, 1)} · {total} runs {isFetching
&& '· updating…'}
</span>
<div className="flex gap-2">
<button className={BUTTON} disabled={page <= 1} onClick={() =>
onPageChange(page - 1)}>
Previous
</button>
<button
className={BUTTON}
disabled={page >= totalPages}
onClick={() => onPageChange(page + 1)}
>
Next
</button>
</div>
</div>
);
}