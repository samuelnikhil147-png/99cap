import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  BedDouble, 
  Users, 
  BarChart3, 
  Settings,
  Hotel,
  LogOut,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [lookup, setLookup] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Rooms', icon: BedDouble, path: '/' },
    { name: 'Check-Out', icon: LogOut, path: '/checkout-list' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Reports', icon: BarChart3, path: '/reports', adminOnly: true },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const query = lookup.toLowerCase().trim();
      if (!query) return;

      if (query.includes('room') || query.includes('bed') || query.includes('dash')) navigate('/');
      else if (query.includes('check') || query.includes('out') || query.includes('bill')) navigate('/checkout-list');
      else if (query.includes('cust') || query.includes('guest')) navigate('/customers');
      else if (query.includes('repo') || query.includes('analyt') || query.includes('stat')) navigate('/reports');
      else if (query.includes('dark') || query.includes('mode') || query.includes('theme')) navigate('/settings', { state: { tab: 'General' } });
      else if (query.includes('prof') || query.includes('email') || query.includes('user')) navigate('/settings', { state: { tab: 'Profile' } });
      else if (query.includes('notif') || query.includes('alert') || query.includes('bell')) navigate('/settings', { state: { tab: 'Notifications' } });
      else if (query.includes('secu') || query.includes('pass') || query.includes('priv')) navigate('/settings', { state: { tab: 'Security' } });
      else if (query.includes('set') || query.includes('config')) navigate('/settings');
      
      setLookup('');
      setIsMenuOpen(false);
    }
  };

  const filteredItems = navItems.filter(item => !item.adminOnly || (user && user.role === 'admin'));

  return (
    <>
      <header className="w-full bg-[#000000] border-b border-[#111111] shrink-0 z-[60] h-16 flex items-center px-4 lg:px-6 justify-between shadow-lg transition-colors sticky top-0">
        {/* Left: Branding & Mobile Toggle */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5 overflow-hidden shrink-0">
              <img src="/logo.png" alt="99 Capsule Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block shrink-0">
              <h1 className="text-[14px] lg:text-[15px] font-bold text-white tracking-tight leading-none">99 Capsule</h1>
              <p className="text-[9px] lg:text-[10px] font-bold text-[#14B8A6] uppercase tracking-[0.15em] mt-1 leading-none">Staff Portal</p>
            </div>
          </div>

          {/* Center-Left: Main Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
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

        {/* Center: Flexible Search Bar (Extends toward nav) */}
        <div className="hidden lg:flex flex-1 items-center justify-end max-w-4xl px-6 lg:px-10 ml-auto">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#14B8A6] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Quick lookup keywords: 'room', 'checkout', 'profile'..."
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-[14px] text-white placeholder-white/30 focus:bg-white/10 focus:border-[#14B8A6]/50 focus:ring-4 focus:ring-[#14B8A6]/5 outline-none transition-all duration-300"
            />
          </div>
        </div>

        {/* Right: Tools & Profile */}
        <div className="flex items-center gap-3 lg:gap-4 shrink-0">
          <div className="hidden sm:block h-6 w-[1px] bg-white/10 mx-1 shrink-0"></div>

          {/* User Profile Hook */}
          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            <div className="flex items-center gap-2.5 px-2 lg:px-3 h-10 rounded-lg bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
              <div className="w-7 h-7 rounded-md bg-[#14B8A6] flex items-center justify-center text-[#000000] font-black text-[12px] uppercase">
                {(user?.username || 'A').charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[13px] font-bold text-white leading-none group-hover:text-[#14B8A6] transition-colors">{user?.username || 'admin'}</p>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Authorized</p>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="flex items-center justify-center lg:justify-start gap-2 h-10 w-10 lg:w-auto lg:px-3 rounded-lg bg-[#EF4444]/10 text-[#EF4444] font-bold text-[13px] hover:bg-[#EF4444] hover:text-white transition-all active:scale-95 border border-[#EF4444]/20"
            >
              <LogOut size={16} />
              <span className="hidden lg:inline">Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-300 animate-in fade-in" onClick={() => setIsMenuOpen(false)}>
          <div 
            className="w-72 h-full bg-[#000000] p-6 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#14B8A6] rounded-lg flex items-center justify-center text-white">
                <Hotel size={20} />
              </div>
              <div>
                <h2 className="text-white font-bold">99 Capsule</h2>
                <p className="text-[10px] text-[#14B8A6] uppercase font-bold tracking-widest">Management</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
              <input 
                type="text" 
                placeholder="Quick lookup..."
                value={lookup}
                onChange={(e) => setLookup(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-[14px] text-white outline-none focus:border-[#14B8A6]/50 transition-all"
              />
            </div>

            <nav className="flex flex-col gap-2">
              {filteredItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 p-3.5 rounded-xl transition-all
                    ${isActive ? 'bg-[#14B8A6] text-black font-bold' : 'text-white/70 hover:bg-white/5'}
                  `}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#14B8A6] flex items-center justify-center text-black font-bold">
                   {(user?.username || 'A').charAt(0)}
                </div>
                <div>
                   <p className="text-white font-bold">{user?.username || 'admin'}</p>
                   <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Authorized Staff</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-[#EF4444] text-white font-bold transition-all active:scale-95"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
