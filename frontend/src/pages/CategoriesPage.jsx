import { useEffect, useState } from 'react';
import useCategories from '../hooks/useCategories';
import CategoryForm from '../components/CategoryForm';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import categoryService from '../services/categoryService';
import { Plus, Edit2, Trash2, Calendar, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const { categories, loading, error, fetchAll } = useCategories();
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (selectedCategory) {
        await categoryService.update(selectedCategory.id, payload);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.create(payload);
        toast.success('Category created successfully!');
      }
      setIsFormOpen(false);
      setSelectedCategory(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryService.delete(categoryToDelete.id);
      toast.success('Category and its products deleted successfully!');
      setCategoryToDelete(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight my-0">
            Categories Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Group your products by categories. Warning: deleting a category deletes all its associated products.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg transition shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <span>Error: {error}</span>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Fetching categories..." />
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <FolderOpen className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-medium text-slate-800">No categories found</h3>
          <p className="text-slate-500 text-sm mt-1">
            Get started by creating your first product category.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Category ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Date Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-slate-400 text-xs">
                      #{category.id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(category.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(category)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Category Name"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Category"
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
      )}

      {/* Modals */}
      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedCategory(null);
          }}
        />
      )}

      {categoryToDelete && (
        <DeleteConfirmationModal
          title="Delete Category"
          message={`Are you sure you want to delete "${categoryToDelete.name}"? This will also delete ALL products matching this category. This action is irreversible.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
}
