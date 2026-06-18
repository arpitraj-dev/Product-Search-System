import { Link } from 'react-router-dom';
import { Package, ShieldCheck, Heart, Globe } from 'lucide-react';

export default function Footer({ className = '' }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-slate-950/45 backdrop-blur-md border-t border-white/5 text-slate-400 py-12 relative z-10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo & Platform Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Package className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-sm font-extrabold text-white tracking-tight">
                Product Search System
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              A premium, search-first product discovery platform powered by Spring Boot JPA Specifications on the backend and React Glassmorphism layouts on the frontend.
            </p>
          </div>

          {/* Quick Navigation links */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-semibold list-none my-0 py-0 pl-0">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-indigo-400 transition-colors">Search & Discover</Link>
              </li>
              <li>
                <Link to="/admin/products" className="hover:text-indigo-400 transition-colors">Manage Products</Link>
              </li>
              <li>
                <Link to="/admin/categories" className="hover:text-indigo-400 transition-colors">Manage Categories</Link>
              </li>
            </ul>
          </div>

          {/* System Tech Stack badges */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Java 21', 'Spring Boot 3', 'Spring Data JPA', 'MySQL', 'React 19', 'Tailwind CSS v4', 'Framer Motion'].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-white/5 border border-white/8 text-[9px] font-bold text-slate-300 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & Copyright area */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Product Search System. Built by</span>

            <span>Arpit</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Production Ready</span>
            </div>

            <a
              href="https://github.com/arpitraj-dev/Product-Search-System"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
              title="GitHub Repository"
            >
              <Globe className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
