import { NavLink } from 'react-router-dom';
import { FolderKanban, Package, Home } from 'lucide-react';

export default function Sidebar() {
  const items = [
    { to: '/admin/products', label: 'Manage Products', icon: Package },
    { to: '/admin/categories', label: 'Manage Categories', icon: FolderKanban },
    { to: '/', label: 'Back to Home', icon: Home },
  ];

  return (
    <aside className="w-64 bg-slate-950/30 backdrop-blur-xl border-r border-white/5 text-slate-300 min-h-[calc(100vh-4rem)] hidden md:block flex-shrink-0">
      <div className="p-6 sticky top-20">
        <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          Control Panel
        </h2>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive && item.to !== '/'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500/20'
                      : 'hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
