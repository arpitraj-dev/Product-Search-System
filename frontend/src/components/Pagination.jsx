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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg mt-8">
      
      {/* Dynamic results tracker */}
      <div className="text-xs sm:text-sm text-slate-400 font-medium">
        Showing <span className="font-bold text-white">{startIdx}</span> to{' '}
        <span className="font-bold text-white">{endIdx}</span> of{' '}
        <span className="font-bold text-white">{totalElements}</span> items
      </div>

      {/* Pages controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 border border-white/10 bg-slate-950/20 rounded-xl hover:bg-white/5 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => {
          // Truncation rules for high page counts
          if (
            totalPages > 5 &&
            p !== 0 &&
            p !== totalPages - 1 &&
            Math.abs(p - currentPage) > 1
          ) {
            if (p === 1 && currentPage > 2) {
              return (
                <span key="dots-start" className="px-1.5 text-slate-500 text-sm font-bold">
                  ...
                </span>
              );
            }
            if (p === totalPages - 2 && currentPage < totalPages - 3) {
              return (
                <span key="dots-end" className="px-1.5 text-slate-500 text-sm font-bold">
                  ...
                </span>
              );
            }
            return null;
          }

          const isActive = currentPage === p;

          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-9 h-9 flex items-center justify-center text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 border border-indigo-500/25'
                  : 'border border-white/10 bg-slate-950/20 text-slate-300 hover:bg-white/5'
              }`}
            >
              {p + 1}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-2 border border-white/10 bg-slate-950/20 rounded-xl hover:bg-white/5 text-slate-300 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
