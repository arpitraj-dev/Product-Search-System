import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden text-slate-100">
      
      {/* 1. Rotational mesh gradient canvas */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 animate-gradient-bg pointer-events-none z-0" />

      {/* 2. Floating Blur Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Orb 1: Top Left */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-[130px] animate-orb-1" />
        {/* Orb 2: Middle Right */}
        <div className="absolute top-1/4 -right-20 w-[450px] h-[450px] rounded-full bg-purple-500/8 blur-[160px] animate-orb-2" />
        {/* Orb 3: Bottom Left */}
        <div className="absolute -bottom-20 left-10 w-80 h-80 rounded-full bg-cyan-500/8 blur-[110px] animate-orb-3" />
      </div>

      {/* 3. Subtle grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* 4. Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Glass Navbar */}
        <Navbar />
        
        <div className="flex flex-1">
          {/* Admin Sidebar */}
          {isAdminRoute && <Sidebar />}
          
          {/* Main Content Area with Page transitions */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/products/:id" element={<ProductDetailsPage />} />
                  <Route path="/admin/products" element={<ProductsPage />} />
                  <Route path="/admin/categories" element={<CategoriesPage />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(15, 23, 42, 0.8)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            fontSize: '14px',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
