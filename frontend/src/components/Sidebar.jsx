import { NavLink } from 'react-router-dom';
import { FolderKanban, Package, Home, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const items = [
    { to: '/admin/products', label: 'Manage Products', icon: Package },
    { to: '/admin/categories', label: 'Manage Categories', icon: FolderKanban },
    { to: '/', label: 'Back to Home', icon: Home },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[80] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-slate-950/95 backdrop-blur-2xl border-r border-white/10 text-slate-300 z-[90] p-6 transform transition-transform duration-300 ease-out md:relative md:translate-x-0 md:inset-auto md:z-auto md:w-64 md:bg-slate-950/30 md:backdrop-blur-xl md:border-r md:border-white/5 md:min-h-[calc(100vh-4rem)] md:flex-shrink-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between mb-8 md:mb-6">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest my-0">
              Control Panel
            </h2>
            <span className="text-[9px] text-slate-500 font-semibold mt-0.5 md:hidden">Administration Console</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Close Menu"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="space-y-1.5 flex-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isBack = item.to === '/';
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 relative group overflow-hidden ${
                    isActive && !isBack
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/15 border border-indigo-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active accent vertical line glow */}
                    {isActive && !isBack && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-md shadow-[0_0_10px_#ffffff]" />
                    )}
                    
                    <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 duration-300 ${
                      isActive && !isBack ? 'text-white' : 'text-indigo-400 group-hover:text-white'
                    }`} />
                    
                    <span className="relative z-10">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        
        {/* Footer branding slot in sidebar */}
        <div className="border-t border-white/5 pt-4 mt-auto">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Live Console
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

