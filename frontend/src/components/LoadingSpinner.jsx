import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <p className="mt-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}
