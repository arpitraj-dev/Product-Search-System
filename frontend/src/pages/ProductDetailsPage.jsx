import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../services/productService';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Calendar, Package, Tag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await productService.getById(id);
        setProduct(res.data);
      } catch (err) {
        toast.error('Failed to load product details.');
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, navigate]);

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingSpinner message="Fetching details..." />;
  }

  if (!product) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 animate-in fade-in duration-300">
      
      {/* Navigation Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
        <ArrowRight className="w-3 h-3 text-slate-600" />
        <Link to="/search" className="hover:text-indigo-400 transition-colors">Search & Discover</Link>
        <ArrowRight className="w-3 h-3 text-slate-600" />
        <span className="text-slate-300 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-white/20 bg-slate-900/50 hover:bg-white/5 rounded-xl text-xs font-bold text-slate-300 transition shadow-md cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Go Back</span>
      </button>

      {/* Main Details Presentation Card */}
      <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-white/5">
        
        {/* Placeholder decorative banner */}
        <div className="w-full md:w-80 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 border-r border-white/5 flex flex-col items-center justify-center p-8 text-white text-center gap-4 min-h-[300px]">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
            <Package className="w-10 h-10 text-indigo-400" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow">
              <Tag className="w-3 h-3" />
              {product.categoryName || 'Uncategorized'}
            </span>
          </div>
        </div>

        {/* Informative side panel */}
        <div className="flex-1 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight my-0">
              {product.name}
            </h1>

            {/* Price Presentation */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Price</span>
              <span className="text-3xl font-black text-indigo-400 mt-0.5 tracking-tight">
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4 border-t border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Description</span>
              <p className="text-slate-300 text-sm leading-relaxed my-0">
                {product.description || 'No descriptive context was added for this catalog entry.'}
              </p>
            </div>
          </div>

          {/* Timestamps logs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/5 text-xs text-slate-500">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" />
              <div>
                <span className="font-semibold block text-slate-400">Date Added</span>
                <span>{formatDate(product.createdAt)}</span>
              </div>
            </div>
            {product.updatedAt && (
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" />
                <div>
                  <span className="font-semibold block text-slate-400">Last Modified</span>
                  <span>{formatDate(product.updatedAt)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
