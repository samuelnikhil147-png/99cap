import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BedDouble, 
  Users, 
  BarChart3, 
  Settings,
  Hotel,
  LogOut
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
          className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container - Enterprise Professional Style */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[260px] h-screen bg-white
        border-r border-[#E5E7EB] flex flex-col shadow-sm
        transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Section 1 — Branding (High Contrast Anchor) */}
        <div className="h-16 shrink-0 flex items-center px-6 bg-[#0F172A] border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#14B8A6] rounded-lg flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#14B8A6]/20">
              <Hotel size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[16px] font-semibold text-white tracking-tight">
                99 Capsule
              </h1>
              <p className="text-[11px] font-medium text-[#14B8A6] uppercase tracking-wider leading-none mt-0.5">
                Staff Portal
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 — Menu (Professional List) */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
          {filteredItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 h-11 px-3.5 rounded-[10px] transition-all duration-200 w-full group
                ${isActive 
                  ? 'bg-[#0F172A] text-white shadow-sm' 
                  : 'text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#111827]'}
              `}
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isActive ? 'bg-[#14B8A6]/20 text-white' : 'bg-[#0F172A] text-white group-hover:scale-105'}`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-[14px] font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Section 3 — Staff Management */}
        <div className="mt-auto p-4 space-y-2 w-full border-t border-[#E5E7EB]">
          {/* User Status Card */}
          <div className="flex items-center gap-3 h-12 px-3.5 rounded-[10px] transition-all duration-200 w-full cursor-pointer hover:bg-[#F1F5F9] group">
            <div className="w-9 h-9 rounded-lg bg-[#0F172A] flex items-center justify-center text-white shrink-0 font-bold text-[14px] uppercase group-hover:bg-[#14B8A6] transition-all">
              {(user?.username || 'P').charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#111827] truncate leading-tight group-hover:text-[#0F172A]">
                {user?.username || 'Pardhin'}
              </p>
              <p className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mt-0.5 leading-none">
                {user?.role || 'System Admin'}
              </p>
            </div>
          </div>
          
          {/* Action: Sign Out */}
          <button 
            onClick={onLogout}
            className="w-full h-11 px-3.5 flex items-center gap-3 rounded-[10px] text-[#EF4444] font-semibold text-[14px] hover:bg-red-50 transition-all duration-200 active:scale-95"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
               <LogOut size={18} />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
