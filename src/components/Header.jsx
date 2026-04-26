import { Search, Bell, Mail, ChevronDown, Menu } from 'lucide-react';
import { notify } from './Toast';

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="h-16 bg-[#0F172A] border-b border-[#1F2937] px-6 grid grid-cols-[auto_1fr_auto] items-center shrink-0 transition-all duration-200">
      {/* Left Section - Logo Anchor */}
      <div className="flex items-center">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-white/70 hover:bg-white/10 rounded-lg md:hidden transition-all duration-200"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Center: Search (Visually Centered) */}
      <div className="flex justify-center items-center">
        <div className="w-[420px] max-w-full relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] group-focus-within:text-[#14B8A6] transition-colors duration-200" size={16} />
          <input 
            type="text" 
            placeholder="Search bookings, rooms, or guests..." 
            onKeyDown={(e) => e.key === 'Enter' && notify('Searching secure records...', 'info')}
            className="w-full h-10 pl-10 pr-4 bg-white border border-[#E5E7EB] rounded-[10px] text-[14px] text-[#111827] placeholder-[#9CA3AF] focus:ring-4 focus:ring-[#14B8A6]/10 focus:border-[#14B8A6] transition-all duration-200 outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => notify('Checking live notifications...', 'info')}
            className="p-2 text-white/70 hover:bg-white/10 rounded-lg transition-all duration-200 relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] border-2 border-[#0F172A] rounded-full"></span>
          </button>
          <button 
            onClick={() => notify('Opening staff communications...', 'info')}
            className="p-2 text-white/70 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            <Mail size={20} />
          </button>
        </div>

        <div 
          onClick={() => notify('Profile management coming soon!', 'info')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-semibold text-white group-hover:text-[#14B8A6] transition-colors leading-none">Pardhin</p>
            <p className="text-[11px] text-white/50 font-medium mt-1 uppercase tracking-wider">System Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden border border-[#1F2937] group-hover:border-[#14B8A6] transition-all shadow-md">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Pardhin" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <ChevronDown className="text-white/40 group-hover:text-white transition-colors" size={14} />
        </div>
      </div>
    </header>
  );
};

export default Header;
