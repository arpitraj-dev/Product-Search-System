import { Edit2, Trash2, Calendar, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onEdit, onDelete }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="glass-card rounded-2xl flex flex-col h-full overflow-hidden group">
      
      {/* Decorative dark image slot banner */}
      <div className="h-40 bg-slate-950/40 flex items-center justify-center relative border-b border-white/5 group-hover:bg-slate-950/20 transition-colors duration-300">
        <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/35 transition-all duration-300">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          {product.categoryName || 'Uncategorized'}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-white text-base mb-1 group-hover:text-indigo-400 transition-colors duration-300">
            {product.name}
          </h3>
          
          <p className="text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">
            {product.description || 'No description provided.'}
          </p>
        </div>

        {/* Info & pricing tags */}
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Price</span>
            <span className="text-base font-black text-indigo-400 tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Edit Product"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer calendar timestamp banner */}
      <div className="px-5 py-2.5 bg-slate-950/40 border-t border-white/5 text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-slate-500" />
        <span>Added {formatDate(product.createdAt)}</span>
      </div>
    </div>
  );
}
