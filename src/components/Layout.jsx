import { useState } from 'react';
import Navbar from './Navbar';
import Toast from './Toast';

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Toast />
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
