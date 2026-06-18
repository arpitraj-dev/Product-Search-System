import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCategories from '../hooks/useCategories';
import useProducts from '../hooks/useProducts';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, ArrowRight, FolderKanban, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
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

export default function Home() {
  const navigate = useNavigate();
  const { categories, fetchAll: fetchCategories, loading: loadingCats } = useCategories();
  const { allProducts, fetchAll: fetchProducts, loading: loadingProds } = useProducts();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleSearchSubmit = (keyword) => {
    if (keyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/search?categoryId=${categoryId}`);
  };

  // Slice top 4 recent products as "Trending / Discover" products
  const trendingProducts = allProducts.slice(0, 4);
  const loading = loadingCats || loadingProds;

  return (
    <div className="space-y-16 py-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* Hero Search Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto py-8 relative">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Premium Product Discovery Engine</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 tracking-tight leading-none my-0 py-1">
          Find Products Instantly
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Search, filter, and discover products across categories in real time. Powered by an advanced Spring Boot schema search framework.
        </p>

        {/* Big Centered Search Bar */}
        <div className="pt-4 flex justify-center">
          <div className="w-full max-w-2xl shadow-2xl shadow-indigo-950/20 hover:shadow-indigo-950/30 transition-shadow">
            <SearchBar
              onSearch={handleSearchSubmit}
              placeholder="Search products by model, brand name, or code..."
              isLarge={true}
            />
          </div>
        </div>
      </div>

      {/* Category Discovery Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white my-0">Explore Categories</h2>
            <p className="text-slate-500 text-xs mt-0.5">Filter the entire database instantly on click.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <FolderKanban className="w-4 h-4 text-slate-400" />
            {categories.length} Categories Classified
          </span>
        </div>

        {loadingCats ? (
          <div className="py-6 flex justify-center"><LoadingSpinner message="" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="glass-card p-4 rounded-xl flex flex-col items-center justify-center gap-2 group cursor-pointer text-center"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-indigo-500/10 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors truncate w-full">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Trending / Recent Products */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white my-0">Featured Products</h2>
            <p className="text-slate-500 text-xs mt-0.5">Recent elements cataloged directly in our system.</p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Browse entire catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner message="Loading catalog items..." /></div>
        ) : trendingProducts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trendingProducts.map((p) => (
              <motion.div variants={itemVariants} key={p.id}>
                <ProductCard
                  product={p}
                  onEdit={() => navigate('/admin/products')}
                  onDelete={() => navigate('/admin/products')}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass-card text-center py-12 rounded-xl text-slate-400 text-sm">
            No products found. Create items in the administration portal!
          </div>
        )}
      </div>
    </div>
  );
}
