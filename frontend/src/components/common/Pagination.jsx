function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-3">
      <button className="rounded-xl border border-slate-800 px-3 py-2 text-sm text-slate-300 disabled:opacity-40" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
      <button className="rounded-xl border border-slate-800 px-3 py-2 text-sm text-slate-300 disabled:opacity-40" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

export default Pagination;

