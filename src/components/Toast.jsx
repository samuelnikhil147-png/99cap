import React, { useState, useEffect } from 'react';
import { CheckCircle, Info, XCircle, X } from 'lucide-react';

const Toast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleShowToast = (event) => {
      setToast(event.detail);
      setTimeout(() => {
        setToast(null);
      }, 3000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={18} />,
    info: <Info className="text-blue-500" size={18} />,
    error: <XCircle className="text-rose-500" size={18} />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100',
    info: 'bg-blue-50 border-blue-100',
    error: 'bg-rose-50 border-rose-100',
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-xl animate-in fade-in slide-in-from-right-4 duration-300 ${bgColors[toast.type || 'info']}`}>
      {icons[toast.type || 'info']}
      <p className="text-sm font-bold text-slate-800">{toast.message}</p>
      <button 
        onClick={() => setToast(null)}
        className="ml-4 p-1 hover:bg-black/5 rounded-lg transition-colors"
      >
        <X size={14} className="text-slate-400" />
      </button>
    </div>
  );
};

export const notify = (message, type = 'success') => {
  const event = new CustomEvent('show-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};

export default Toast;
