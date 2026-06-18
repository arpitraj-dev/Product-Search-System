export default function ProductSkeleton() {
  return (
    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-5 flex flex-col h-full overflow-hidden relative backdrop-blur-md animate-pulse">
      {/* Visual Image Banner Placeholder */}
      <div className="h-40 bg-slate-800/60 rounded-xl mb-4" />

      {/* Info Block */}
      <div className="space-y-3 flex-1 flex flex-col">
        {/* Name */}
        <div className="h-5 bg-slate-800/60 rounded-md w-2/3" />
        
        {/* Category tag */}
        <div className="h-4 bg-slate-800/40 rounded-full w-1/4" />
        
        {/* Description Lines */}
        <div className="space-y-2 flex-1 pt-2">
          <div className="h-3.5 bg-slate-800/30 rounded-md w-full" />
          <div className="h-3.5 bg-slate-800/30 rounded-md w-5/6" />
        </div>

        {/* Footer info and actions */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
          <div className="space-y-2 w-1/3">
            <div className="h-3 bg-slate-800/30 rounded w-1/2" />
            <div className="h-5 bg-slate-800/60 rounded w-full" />
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-800/60" />
            <div className="w-8 h-8 rounded-lg bg-slate-800/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
