import { useEffect, useState, useCallback } from 'react';
import useProducts from '../hooks/useProducts';
import useCategories from '../hooks/useCategories';
import SearchBar from '../components/SearchBar';
import ProductTable from '../components/ProductTable';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import ProductForm from '../components/ProductForm';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import productService from '../services/productService';
import { LayoutGrid, List, Plus, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS, PAGE_SIZES, DEFAULT_PAGE_SIZE } from '../utils/constants';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { searchResult, loading, error, search } = useProducts();
  const { categories, fetchAll: fetchCategories } = useCategories();

  // Filter and pagination states
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [direction, setDirection] = useState('desc');
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Trigger search on parameter change
  const handleFetch = useCallback(
    (page = 0) => {
      search({
        keyword,
        categoryId: categoryId || undefined,
        page,
        size: pageSize,
        sortBy,
        direction,
      });
    },
    [search, keyword, categoryId, pageSize, sortBy, direction]
  );

  useEffect(() => {
    handleFetch(0);
    fetchCategories();
  }, [handleFetch, fetchCategories]);

  // Actions handlers
  const handleSearch = (term) => {
    setKeyword(term);
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleDirectionToggle = () => {
    setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (selectedProduct) {
        await productService.update(selectedProduct.id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productService.create(payload);
        toast.success('Product created successfully!');
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
      handleFetch(searchResult.currentPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await productService.delete(productToDelete.id);
      toast.success('Product deleted successfully!');
      setProductToDelete(null);
      const isLastItemOnPage = searchResult.products.length === 1;
      const targetPage = isLastItemOnPage && searchResult.currentPage > 0 
        ? searchResult.currentPage - 1 
        : searchResult.currentPage;
      handleFetch(targetPage);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight my-0">
            Products Catalog
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Browse, manage, and modify raw database records in the product repository.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-indigo-600/10 border border-indigo-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Control Panel (Filters, Sort, Views) */}
      <div className="glass-panel p-5 rounded-2xl shadow-md space-y-4 border-white/5 relative z-20">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
          <SearchBar value={keyword} onSearch={handleSearch} placeholder="Search product catalogs..." />
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort by {opt.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleDirectionToggle}
                className="p-2 border border-white/10 bg-slate-900/50 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer"
                title={`Sort ${direction === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="border-l border-white/10 pl-3 flex items-center bg-slate-900/60 rounded-xl p-1 border border-white/5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg ${
                  viewMode === 'table' ? 'bg-white/10 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg ${
                  viewMode === 'grid' ? 'bg-white/10 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Page size configuration */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/5 pt-3">
          <span className="font-semibold text-slate-400">
            {searchResult.totalElements} products cataloged.
          </span>
          <div className="flex items-center gap-2">
            <span>Show per page:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="bg-transparent border-none text-slate-300 font-bold cursor-pointer focus:outline-none"
            >
              {PAGE_SIZES.map((sz) => (
                <option key={sz} value={sz} className="bg-slate-950">
                  {sz} rows
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <span>Error: {error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 flex justify-center"><LoadingSpinner message="Fetching matching products..." /></div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <ProductTable
              products={searchResult.products}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ) : (
            searchResult.products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResult.products.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 rounded-xl border border-white/5 text-slate-400 shadow-md">
                <LayoutGrid className="w-12 h-12 text-slate-500 mb-3 animate-pulse" />
                <h3 className="text-lg font-bold text-white my-0">No products found</h3>
              </div>
            )
          )}

          {/* Pagination component */}
          <Pagination
            currentPage={searchResult.currentPage}
            totalPages={searchResult.totalPages}
            totalElements={searchResult.totalElements}
            pageSize={pageSize}
            onPageChange={handleFetch}
          />
        </>
      )}

      {/* Modals */}
      {isFormOpen && (
        <ProductForm
          product={selectedProduct}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {productToDelete && (
        <DeleteConfirmationModal
          title="Delete Product"
          message={`Are you sure you want to delete "${productToDelete.name}"? This action is permanent.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      )}
    </div>
  );
}
