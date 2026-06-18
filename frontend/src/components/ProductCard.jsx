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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col h-full overflow-hidden group">
      {/* Visual placeholder for Product Image to make it look highly professional */}
      <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center relative border-b border-slate-100 group-hover:from-indigo-50/30 group-hover:to-purple-50/30 transition-colors">
        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/50">
          {product.categoryName || 'Uncategorized'}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-slate-800 text-base mb-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-1">
          {product.description || 'No description provided.'}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Price</span>
            <span className="text-lg font-bold text-slate-800">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(product)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Product"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5" />
        <span>Added on {formatDate(product.createdAt)}</span>
      </div>
    </div>
  );
}
