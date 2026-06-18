import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmationModal({ title, message, onConfirm, onCancel }) {
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onCancel} />
      
      {/* Glass Alert Modal */}
      <div className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 text-white animate-in fade-in zoom-in-95">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white my-0">{title}</h3>
        </div>

        <p className="text-slate-400 text-sm mb-6 ml-[52px] leading-relaxed my-0">{message}</p>

        <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/10 border border-red-500/20"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

