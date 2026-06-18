import { useForm } from 'react-hook-form';
import { X, Save, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CategoryForm({
  category = null,
  onSubmit,
  onCancel,
}) {
  const isEdit = !!category;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (category) {
      setValue('name', category.name);
    }
  }, [category, setValue]);

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={onCancel} />
      
      {/* Glass Form Panel */}
      <div className="relative bg-slate-900 border border-white/10 rounded-2xl shadow-2xl max-w-md w-full p-6 text-white animate-in fade-in zoom-in-95">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white rounded-lg p-1.5 hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-white mb-6">
          {isEdit ? 'Update Category Name' : 'Create New Category'}
        </h3>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Category name is required',
                maxLength: {
                  value: 255,
                  message: 'Category name must not exceed 255 characters',
                },
              })}
              placeholder="e.g. Home & Kitchen"
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
              <span>{isEdit ? 'Save Changes' : 'Create Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

