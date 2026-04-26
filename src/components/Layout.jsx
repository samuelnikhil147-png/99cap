import { useState } from 'react';
import Navbar from './Navbar';
import Toast from './Toast';

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] dark:bg-[#000000] overflow-hidden font-sans transition-colors duration-500">
      <Toast />
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 lg:py-8">
        <div className="max-w-[1600px] mx-auto text-slate-900 dark:text-white">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
