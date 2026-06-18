import { Edit2, Trash2, Calendar, Package } from 'lucide-react';

export default function ProductTable({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-white/5 rounded-2xl shadow-lg">
        <Package className="w-12 h-12 text-slate-500 mb-3 animate-pulse" />
        <h3 className="text-lg font-bold text-white my-0">No products found</h3>
        <p className="text-slate-400 text-sm mt-1 max-w-xs text-center leading-relaxed">
          Try adjusting your search filters or add a new product using the dashboard controls.
        </p>
      </div>
    );
  }

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
    <div className="glass-panel shadow-xl overflow-hidden rounded-2xl border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/50 border-b border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Date Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-slate-300">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white group-hover:text-indigo-400 transition-colors duration-300">
                      {product.name}
                    </span>
                    {product.description && (
                      <span className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-xs">
                        {product.description}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {product.categoryName || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-indigo-400">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
