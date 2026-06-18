import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useCategories from '../hooks/useCategories';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Package,
  FolderKanban,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  PlusCircle,
  FolderPlus,
} from 'lucide-react';

export default function Dashboard() {
  const { allProducts, fetchAll: fetchProducts, loading: loadingProducts } = useProducts();
  const { categories, fetchAll: fetchCategories, loading: loadingCategories } = useCategories();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const loading = loadingProducts || loadingCategories;

  const totalProducts = allProducts.length;
  const totalCategories = categories.length;

  const averagePrice =
    totalProducts > 0
      ? allProducts.reduce((sum, p) => sum + Number(p.price), 0) / totalProducts
      : 0;

  const mostExpensiveProduct =
    totalProducts > 0
      ? [...allProducts].sort((a, b) => Number(b.price) - Number(a.price))[0]
      : null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(price);
  };

  const recentProducts = allProducts.slice(0, 5);
  const recentCategories = categories.slice(0, 5);

  if (loading) {
    return <LoadingSpinner message="Calculating dashboard statistics..." />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight my-0">
            Overview Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time catalog analytics and search dashboard metrics.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            to="/categories"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <FolderPlus className="w-4 h-4 text-purple-600" />
            <span>Category Manager</span>
          </Link>
          <Link
            to="/products"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Product Catalog</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Products
            </span>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{totalProducts}</span>
            <span className="text-xs text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
              Active items
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>

        {/* Total Categories */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Categories
            </span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{totalCategories}</span>
            <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-1.5 py-0.5 rounded">
              Classified
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>

        {/* Average Price */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Average Price
            </span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-800 truncate">
              {formatPrice(averagePrice)}
            </span>
            <span className="text-xs text-slate-400 mt-1">Catalog mean value</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>

        {/* Most Expensive Product */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Peak Value Item
            </span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 line-clamp-1">
              {mostExpensiveProduct ? mostExpensiveProduct.name : 'N/A'}
            </span>
            <span className="text-base font-extrabold text-amber-600 mt-0.5">
              {mostExpensiveProduct ? formatPrice(mostExpensiveProduct.price) : '-'}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>
      </div>

      {/* Detailed Tables Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 my-0">Recent Products</h3>
            <Link
              to="/products"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              <span>View catalog</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            {recentProducts.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                    <th className="px-6 py-3">Product</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                  {recentProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-3.5 font-medium text-slate-800">{p.name}</td>
                      <td className="px-6 py-3.5 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-full font-medium">
                          {p.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-slate-800">
                        {formatPrice(p.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                No products added yet.
              </div>
            )}
          </div>
        </div>

        {/* Categories Snapshot */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 my-0">Categories snapshot</h3>
            <Link
              to="/categories"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
            >
              <span>Manage all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 divide-y divide-slate-100 flex-1 overflow-y-auto">
            {recentCategories.length > 0 ? (
              recentCategories.map((c) => (
                <div
                  key={c.id}
                  className="py-3 flex items-center justify-between first:pt-0 last:pb-0"
                >
                  <span className="text-sm font-semibold text-slate-800">{c.name}</span>
                  <span className="text-xs text-slate-400">ID: {c.id}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm">
                No categories created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
