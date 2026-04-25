import { Search, Bell, Mail, ChevronDown, Menu } from 'lucide-react';
import { notify } from './Toast';

const Header = ({ setSidebarOpen }) => {
  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex-1 max-w-xl relative hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search rooms..." 
            onKeyDown={(e) => e.key === 'Enter' && notify('Searching system wide...', 'info')}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => notify('Checking live notifications...', 'info')}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </button>
          <button 
            onClick={() => notify('Opening system inbox...', 'info')}
            className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Mail size={20} />
          </button>
        </div>

        <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

        <div 
          onClick={() => notify('Profile management coming soon!', 'info')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Administrator</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">System Admin</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-indigo-100 dark:border-slate-800 group-hover:border-indigo-500 dark:group-hover:border-indigo-400 transition-all">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <ChevronDown className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" size={16} />
        </div>
      </div>
    </header>
  );
};

export default Header;
