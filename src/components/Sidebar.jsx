import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  BarChart3, 
  Settings,
  Hotel,
  LogOut,
  X
} from 'lucide-react';

const Sidebar = ({ user, onLogout, isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Rooms', icon: BedDouble, path: '/' },
    { name: 'Check-Out List', icon: LogOut, path: '/checkout-list' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Reports', icon: BarChart3, path: '/reports', adminOnly: true },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const filteredItems = navItems.filter(item => !item.adminOnly || (user && user.role === 'admin'));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[85%] max-w-[300px] bg-white dark:bg-slate-900 
        border-r border-slate-200 dark:border-slate-800 flex flex-col 
        transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <Hotel size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-indigo-500 bg-clip-text text-transparent truncate">
                99 Capsule
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{user?.role} Portal</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 md:hidden"
          >
            <X size={20} />
          </button>
        </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}
            `}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 mb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs uppercase">
              {user?.username?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.username}</p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{user?.role}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all duration-200 font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
