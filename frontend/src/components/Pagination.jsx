import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const startIdx = currentPage * pageSize + 1;
  const endIdx = Math.min((currentPage + 1) * pageSize, totalElements);

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-slate-200">
      <div className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-800">{startIdx}</span> to{' '}
        <span className="font-semibold text-slate-800">{endIdx}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalElements}</span> results
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => {
          // Logic to truncate pages if there are too many (e.g. > 5 pages)
          if (
            totalPages > 5 &&
            p !== 0 &&
            p !== totalPages - 1 &&
            Math.abs(p - currentPage) > 1
          ) {
            if (p === 1 && currentPage > 2) {
              return (
                <span key="dots-start" className="px-2 text-slate-400">
                  ...
                </span>
              );
            }
            if (p === totalPages - 2 && currentPage < totalPages - 3) {
              return (
                <span key="dots-end" className="px-2 text-slate-400">
                  ...
                </span>
              );
            }
            return null;
          }

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${
                currentPage === p
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p + 1}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
