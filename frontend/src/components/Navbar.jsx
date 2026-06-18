import { Link, useLocation } from 'react-router-dom';
import { Package, Menu, X, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Search & Discover' },
  ];

  const adminLinks = [
    { to: '/admin/products', label: 'Manage Products' },
    { to: '/admin/categories', label: 'Manage Categories' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-950/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo with clean glowing gradient */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-extrabold text-white tracking-tight hidden sm:block">
              Product Search System
            </span>
          </Link>

          {/* Links container */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive(link.to)
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="h-5 w-px bg-white/10" />

            {/* Admin/Management Links */}
            <div className="flex items-center gap-1">
              {adminLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all ${
                    isActive(link.to)
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-indigo-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label === 'Manage Products' && <Settings className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-slate-950/85 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 space-y-1.5">
            {[...links, ...adminLinks].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
