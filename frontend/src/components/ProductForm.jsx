import { useForm } from 'react-hook-form';
import { X, Save, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function ProductForm({
  product = null,
  categories = [],
  onSubmit,
  onCancel,
}) {
  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      categoryId: '',
      price: '',
      description: '',
    },
  });

  useEffect(() => {
    if (product) {
      setValue('name', product.name);
      setValue('categoryId', product.categoryId || '');
      setValue('price', product.price);
      setValue('description', product.description || '');
    }
  }, [product, setValue]);

  const handleFormSubmit = async (data) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
      categoryId: parseInt(data.categoryId, 10),
    };
    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onCancel} />
      
      {/* Glass Form Panel */}
      <div className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-white animate-in fade-in zoom-in-95">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6">
          {isEdit ? 'Update Product Details' : 'Add New Product'}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Product name is required',
                maxLength: {
                  value: 255,
                  message: 'Name cannot exceed 255 characters',
                },
              })}
              placeholder="e.g. Sony WH-1000XM5"
              className={`w-full px-3.5 py-2.5 bg-slate-950/45 border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all ${
                errors.name ? 'border-red-500 bg-red-500/5' : 'border-white/10'
              }`}
            />
            {errors.name && (
              <span className="text-red-400 text-xs mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Category *
              </label>
              <select
                {...register('categoryId', {
                  required: 'Category is required',
                })}
                className={`w-full px-3.5 py-2.5 bg-slate-950/45 border rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all ${
                  errors.categoryId ? 'border-red-500 bg-red-500/5' : 'border-white/10'
                }`}
              >
                <option value="" className="bg-slate-900">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="bg-slate-900 text-white">
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="text-red-400 text-xs mt-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.categoryId.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Price (INR) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Price is required',
                  min: {
                    value: 0.01,
                    message: 'Price must be greater than zero',
                  },
                })}
                placeholder="e.g. 29999"
                className={`w-full px-3.5 py-2.5 bg-slate-950/45 border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all ${
                  errors.price ? 'border-red-500 bg-red-500/5' : 'border-white/10'
                }`}
              />
              {errors.price && (
                <span className="text-red-400 text-xs mt-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Description
            </label>
            <textarea
              rows="3"
              {...register('description', {
                maxLength: {
                  value: 1000,
                  message: 'Description cannot exceed 1000 characters',
                },
              })}
              placeholder="Provide context and details about the product..."
              className={`w-full px-3.5 py-2.5 bg-slate-950/45 border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all ${
                errors.description ? 'border-red-500 bg-red-500/5' : 'border-white/10'
              }`}
            />
            {errors.description && (
              <span className="text-red-400 text-xs mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10 border border-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
