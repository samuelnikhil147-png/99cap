import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BedDouble, 
  Users, 
  BarChart3, 
  Settings,
  Hotel,
  LogOut,
  Search,
  Bell
} from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navItems = [
    { name: 'Rooms', icon: BedDouble, path: '/' },
    { name: 'Check-Out', icon: LogOut, path: '/checkout-list' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Reports', icon: BarChart3, path: '/reports', adminOnly: true },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const filteredItems = navItems.filter(item => !item.adminOnly || (user && user.role === 'admin'));

  return (
    <header className="w-full bg-[#000000] border-b border-[#111111] shrink-0 z-50 h-16 flex items-center px-6 justify-between shadow-lg transition-colors">
      {/* Left: Branding */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-[#14B8A6] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#14B8A6]/20 shrink-0">
            <Hotel size={20} />
          </div>
          <div className="hidden lg:block shrink-0">
            <h1 className="text-[15px] font-bold text-white tracking-tight leading-none">99 Capsule</h1>
            <p className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-[0.15em] mt-1 leading-none">Staff Portal</p>
          </div>
        </div>

        {/* Center-Left: Main Navigation */}
        <nav className="flex items-center gap-1 shrink-0">
          {filteredItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2.5 h-10 px-3 rounded-lg transition-all duration-200 group
                ${isActive 
                  ? 'bg-white text-[#000000] shadow-md' 
                  : 'text-white/60 hover:text-white hover:bg-white/5'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-[#000000] text-white shadow-sm' : 'bg-white/5 text-white/70 group-hover:bg-white/10'}`}>
                    <item.icon size={15} />
                  </div>
                  <span className="text-[13px] font-bold whitespace-nowrap">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right: Tools & Profile */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Compact Search - Fixed Width to prevent layout shift */}
        <div className="hidden xl:flex items-center relative group shrink-0">
          <Search className="absolute left-3 text-white/30 group-focus-within:text-[#14B8A6] transition-colors" size={14} />
          <input 
            type="text" 
            placeholder="Quick lookup..."
            className="w-40 h-9 bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 text-[13px] text-white placeholder-white/20 focus:w-56 focus:bg-white/10 focus:border-[#14B8A6]/50 outline-none transition-all duration-300"
          />
        </div>

        <div className="h-6 w-[1px] bg-white/10 mx-1 shrink-0"></div>

        {/* User Profile Hook */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 px-3 h-10 rounded-lg bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
            <div className="w-7 h-7 rounded-md bg-[#14B8A6] flex items-center justify-center text-[#000000] font-black text-[12px] uppercase">
              {(user?.username || 'A').charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-bold text-white leading-none group-hover:text-[#14B8A6] transition-colors">{user?.username || 'admin'}</p>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Authorized</p>
            </div>
          </div>

          <button 
            onClick={onLogout}
            className="flex items-center gap-2 h-10 px-3 rounded-lg bg-[#EF4444]/10 text-[#EF4444] font-bold text-[13px] hover:bg-[#EF4444] hover:text-white transition-all active:scale-95 border border-[#EF4444]/20"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
