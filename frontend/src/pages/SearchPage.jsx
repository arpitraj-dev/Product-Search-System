import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useProducts from '../hooks/useProducts';
import useCategories from '../hooks/useCategories';
import useDebounce from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import Pagination from '../components/Pagination';
import {
  SlidersHorizontal,
  FolderKanban,
  ArrowUpDown,
  Search,
  X,
  Coins,
  PackageCheck,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { SORT_OPTIONS, DEFAULT_PAGE_SIZE } from '../utils/constants';

// Framer Motion Grid Entrance Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
    },
  },
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse params from URL
  const queryKeyword = searchParams.get('keyword') || '';
  const queryCategoryId = searchParams.get('categoryId') || '';
  const querySortBy = searchParams.get('sortBy') || 'createdAt';
  const queryDirection = searchParams.get('direction') || 'desc';
  const queryPage = Number(searchParams.get('page') || '0');

  // Hooks
  const { searchResult, loading, error, search, allProducts, fetchAll: fetchAllProducts } = useProducts();
  const { categories, fetchAll: fetchCategories } = useCategories();

  // Local sync states
  const [keyword, setKeyword] = useState(queryKeyword);
  const [categoryId, setCategoryId] = useState(queryCategoryId);
  const [sortBy, setSortBy] = useState(querySortBy);
  const [direction, setDirection] = useState(queryDirection);
  const [page, setPage] = useState(queryPage);

  // Client-side Price Range Filters
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Debounced Search Key
  const debouncedKeyword = useDebounce(keyword, 300);

  // Sync URL values back to local states when url changes
  useEffect(() => {
    setKeyword(queryKeyword);
    setCategoryId(queryCategoryId);
    setSortBy(querySortBy);
    setDirection(queryDirection);
    setPage(queryPage);
  }, [queryKeyword, queryCategoryId, querySortBy, queryDirection, queryPage]);

  // Load categories and all products on start
  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, [fetchCategories, fetchAllProducts]);

  // Sync state changes back to searchParams
  const updateUrlParams = useCallback((newParams) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(newParams).forEach(([k, v]) => {
          if (v === undefined || v === null || v === '') {
            next.delete(k);
          } else {
            next.set(k, String(v));
          }
        });
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  // Fetch from backend when parameters change
  useEffect(() => {
    search({
      keyword: debouncedKeyword,
      categoryId: categoryId ? Number(categoryId) : undefined,
      page,
      size: DEFAULT_PAGE_SIZE,
      sortBy,
      direction,
    });
  }, [search, debouncedKeyword, categoryId, page, sortBy, direction]);

  // Handlers for search/filter adjustments
  const handleKeywordSearch = (term) => {
    setKeyword(term);
    setPage(0);
    updateUrlParams({ keyword: term, page: 0 });
  };

  const handleCategoryChange = (catId) => {
    const nextCat = catId === categoryId ? '' : catId; // Toggle off if clicked again
    setCategoryId(nextCat);
    setPage(0);
    updateUrlParams({ categoryId: nextCat, page: 0 });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortBy(val);
    updateUrlParams({ sortBy: val });
  };

  const handleDirectionToggle = () => {
    const nextDir = direction === 'asc' ? 'desc' : 'asc';
    setDirection(nextDir);
    updateUrlParams({ direction: nextDir });
  };

  const handlePageChange = (pageNum) => {
    setPage(pageNum);
    updateUrlParams({ page: pageNum });
  };

  const clearAllFilters = () => {
    setKeyword('');
    setCategoryId('');
    setSortBy('createdAt');
    setDirection('desc');
    setPage(0);
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  // Calculate product counts dynamically per category from cached allProducts
  const getCategoryProductCount = (catId) => {
    return allProducts.filter((p) => String(p.categoryId) === String(catId)).length;
  };

  // Client side filtering on retrieved products for price range
  const filteredProducts = searchResult.products.filter((product) => {
    const price = Number(product.price);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    return true;
  });

  const activeCategoryName = categories.find((c) => String(c.id) === String(categoryId))?.name;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Centered Large Premium Search Hero Header */}
      <div className="glass-panel backdrop-blur-xl border border-white/5 -mx-4 sm:-mx-8 p-12 sm:p-16 text-white flex flex-col items-center justify-center gap-6 relative z-20 rounded-2xl sm:rounded-none shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-500/10 blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950/40 to-slate-950/60 pointer-events-none" />

        <div className="relative z-10 max-w-xl w-full text-center space-y-2.5">
          <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 my-0 tracking-tight leading-none">
            Find Catalog Items
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Search names, prices, categories, and descriptions instantly. Powered by dynamic query specifications.
          </p>
        </div>

        <div className="relative z-10 w-full max-w-2xl shadow-xl shadow-black/40 hover:shadow-black/60 transition-shadow">
          <SearchBar
            value={keyword}
            onSearch={handleKeywordSearch}
            placeholder="Type search queries (e.g. Sony, iPhone, Logitech)..."
          />
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><Search className="w-5 h-5" /></div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Filtered Items</div>
            <div className="text-lg font-black text-white">{filteredProducts.length}</div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><PackageCheck className="w-5 h-5" /></div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Match</div>
            <div className="text-lg font-black text-white">{searchResult.totalElements}</div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"><FolderKanban className="w-5 h-5" /></div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Category</div>
            <div className="text-sm font-extrabold text-white truncate max-w-[110px]">{activeCategoryName || 'All Categories'}</div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-2xl flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400"><Coins className="w-5 h-5" /></div>
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort Metric</div>
            <div className="text-sm font-extrabold text-white truncate">
              {SORT_OPTIONS.find((s) => s.value === sortBy)?.label || 'Created Date'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter + Results Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side Advanced Filters Sidebar - Sticky */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="glass-card p-5 rounded-2xl space-y-6 sticky top-24 shadow-md">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-bold text-white flex items-center gap-2 text-sm">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                Advanced Filters
              </span>
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-bold text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Sort Results By
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 flex-1 transition-all"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleDirectionToggle}
                  className="p-2 border border-white/10 rounded-lg bg-slate-900/50 hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                  title={`Change order to ${direction === 'asc' ? 'descending' : 'ascending'}`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter with Dynamic Badges */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Categories
              </label>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isChecked = String(cat.id) === String(categoryId);
                  const count = getCategoryProductCount(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(String(cat.id))}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 border border-indigo-500/10'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="truncate mr-2">{cat.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                        isChecked ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500 border border-white/5'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Price Bounds (INR)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-6 pr-2.5 py-1.5 border border-white/10 bg-slate-900/40 rounded-lg text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
                <span className="text-slate-600 text-xs font-bold">—</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-6 pr-2.5 py-1.5 border border-white/10 bg-slate-900/40 rounded-lg text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side Results Grid */}
        <div className="flex-1 space-y-6">
          
          {/* Active Chips Row */}
          {(debouncedKeyword || categoryId || minPrice || maxPrice) && (
            <div className="bg-slate-900/30 border border-white/5 p-3.5 rounded-xl flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1">Active Criteria:</span>
              
              {debouncedKeyword && (
                <span className="inline-flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-lg pl-2.5 pr-1.5 py-1 text-xs text-slate-200 font-semibold shadow-sm hover:border-white/15 transition-colors">
                  <span>Search: "{debouncedKeyword}"</span>
                  <button onClick={() => handleKeywordSearch('')} className="p-0.5 text-slate-500 hover:text-red-400 rounded-md transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {categoryId && (
                <span className="inline-flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-lg pl-2.5 pr-1.5 py-1 text-xs text-slate-200 font-semibold shadow-sm hover:border-white/15 transition-colors">
                  <span>Category: {activeCategoryName}</span>
                  <button onClick={() => handleCategoryChange('')} className="p-0.5 text-slate-500 hover:text-red-400 rounded-md transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              {(minPrice || maxPrice) && (
                <span className="inline-flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-lg pl-2.5 pr-1.5 py-1 text-xs text-slate-200 font-semibold shadow-sm hover:border-white/15 transition-colors">
                  <span>Price: ₹{minPrice || '0'} - ₹{maxPrice || '∞'}</span>
                  <button
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="p-0.5 text-slate-500 hover:text-red-400 rounded-md transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline px-2 cursor-pointer transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Loader & Display */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {filteredProducts.map((p) => (
                  <motion.div variants={itemVariants} key={p.id} className="relative group">
                    <ProductCard
                      product={p}
                      onEdit={() => navigate('/admin/products')}
                      onDelete={() => navigate('/admin/products')}
                    />
                    
                    {/* View Details Helper Link overlay */}
                    <button
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="absolute top-3 left-3 bg-slate-900/90 text-white p-2 rounded-lg text-xs font-bold shadow-lg border border-white/10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-pointer hover:bg-indigo-600"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400 group-hover:text-white" />
                      <span>View details</span>
                    </button>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination controls */}
              <Pagination
                currentPage={searchResult.currentPage}
                totalPages={searchResult.totalPages}
                totalElements={searchResult.totalElements}
                pageSize={DEFAULT_PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </div>
          ) : (
            /* Custom Search Empty State */
            <div className="glass-card p-16 rounded-2xl flex flex-col items-center justify-center text-center shadow-md max-w-xl mx-auto border-white/5">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-300 mb-5 animate-bounce">
                <Search className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-white my-0">No matching products found</h3>
              <p className="text-slate-400 text-sm max-w-sm mt-2 mx-auto leading-relaxed">
                We couldn't find anything matching your exact query. Try these suggestions:
              </p>
              
              <div className="text-left max-w-xs mx-auto space-y-2 text-xs text-slate-400 mt-5 border-t border-white/5 pt-5 w-full">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span>Double check search spelling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span>Clear active category tags</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span>Widen the Min/Max price bound inputs</span>
                </div>
              </div>

              <button
                onClick={clearAllFilters}
                className="mt-8 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer border border-indigo-500/25"
              >
                Clear Search Filter Constraints
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
