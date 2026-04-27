import React from 'react';
import { X, CreditCard, Calendar, Clock, User, LogOut } from 'lucide-react';

const CheckoutConfirmationModal = ({ isOpen, onClose, data, onConfirm }) => {
  if (!isOpen || !data) return null;

  const {
    customerName,
    bedId,
    checkIn,
    plannedCheckOut,
    actualCheckOut,
    stayedDays,
    rate = 350,
    totalAmount
  } = data;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-900 p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              Process Checkout
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Final Billing Summary</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto">
          {/* Guest Info */}
          <div className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-600/20">
              #{bedId}
            </div>
            <div>
              <p className="font-black text-slate-900 dark:text-white text-lg leading-tight">{customerName}</p>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Registered Guest</p>
            </div>
          </div>

          {/* Dates Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Check-In Date</label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{checkIn}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Planned Out</label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                <Clock size={14} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-500 line-through">{plannedCheckOut}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest ml-1">Actual Check-Out (Today)</label>
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800">
              <LogOut size={14} className="text-amber-600" />
              <span className="text-sm font-black text-amber-900 dark:text-amber-100">{actualCheckOut}</span>
            </div>
          </div>

          {/* Bill Calculation */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Stay Duration</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{stayedDays} Days (Minimum 1 day applied)</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Daily Rate</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">₹{rate}</span>
            </div>
            <div className="bg-indigo-600 rounded-[1.5rem] p-6 text-white flex items-center justify-between shadow-xl shadow-indigo-600/20">
              <div>
                <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Total Payable</p>
                <p className="text-sm font-medium opacity-90">{stayedDays} days stayed</p>
              </div>
              <div className="text-right">
                <h3 className="text-4xl font-black">₹{totalAmount}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 dark:bg-slate-900 flex gap-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <CreditCard size={20} />
            <span>Collect Payment & Checkout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmationModal;
