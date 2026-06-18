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
    // Form returns price as string, need to convert to number
    const payload = {
      ...data,
      price: parseFloat(data.price),
      categoryId: parseInt(data.categoryId, 10),
    };
    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-800 mb-6">
          {isEdit ? 'Update Product' : 'Add New Product'}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
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
              placeholder="e.g. iPhone 15 Pro"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition ${
                errors.name ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                {...register('categoryId', {
                  required: 'Category is required',
                })}
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition ${
                  errors.categoryId ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
                }`}
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.categoryId.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
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
                placeholder="e.g. 79999"
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition ${
                  errors.price ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
                }`}
              />
              {errors.price && (
                <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
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
              placeholder="Provide details about the product..."
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition ${
                errors.description ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
              }`}
            />
            {errors.description && (
              <span className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1.5"
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
