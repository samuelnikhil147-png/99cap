import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from './Toast';

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-300">
      <Toast />
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 pt-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
