import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, User, Clock, AlertCircle, 
  CheckCircle2, ArrowUpDown, MoreHorizontal, 
  Filter, Download, Trash2, LogOut
} from 'lucide-react';
import { notify } from '../components/Toast';
import ThermalReceipt from '../components/ThermalReceipt';
import CheckoutConfirmationModal from '../components/CheckoutConfirmationModal';

const CheckoutList = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'checkOut', direction: 'asc' });
  const [receiptData, setReceiptData] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingBed, setPendingBed] = useState(null);

  const printBill = (customerName = 'Guest') => {
    const originalTitle = document.title;
    const date = new Date().toLocaleDateString('en-IN').replace(/\//g, '-');
    document.title = `Bill_${customerName}_${date}`;
    setTimeout(() => {
      window.print();
      document.title = originalTitle;
    }, 500);
  };

  const fetchCheckouts = async () => {
    try {
      const response = await fetch('https://99cap.vercel.app/_/backend/api/checkouts/today');
      const data = await response.json();
      setCheckouts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
      notify('Failed to load checkout list', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const handleCheckout = (bed) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const start = new Date(bed.customer.checkIn);
    const end = new Date(todayStr);
    
    // Calculate stayed days: Actual Out - Check In
    let stayedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (stayedDays < 1) stayedDays = 1; // Minimum 1 day charge
    
    const data = {
      customerName: bed.customer.name,
      bedId: bed.id,
      checkIn: bed.customer.checkIn,
      plannedCheckOut: bed.customer.checkOut,
      actualCheckOut: todayStr,
      stayedDays: stayedDays,
      totalAmount: stayedDays * 350
    };

    setPendingBed(bed);
    setReceiptData(data);
    setIsConfirmOpen(true);
  };

  const confirmCheckout = async () => {
    if (!pendingBed) return;
    
    // Close modal first
    setIsConfirmOpen(false);

    // Generate a receipt number if not present
    const finalReceiptData = {
      ...receiptData,
      receiptNo: Math.floor(100000 + Math.random() * 900000).toString()
    };
    setReceiptData(finalReceiptData);

    try {
      const response = await fetch('https://99cap.vercel.app/_/backend/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bedId: pendingBed.id,
          receiptData: finalReceiptData
        })
      });
      
      if (response.ok) {
        notify(`Bed #${pendingBed.id} checked out and saved to Admin`, 'success');
        
        // Trigger print AFTER successful save
        setTimeout(() => {
          printBill(finalReceiptData.customerName);
          fetchCheckouts();
          setPendingBed(null);
        }, 300);
      }
    } catch (error) {
      notify('Server error - Could not save checkout', 'error');
    }
  };

  const handleExtendStay = async (bedId) => {
    const days = window.prompt('Enter additional days to extend stay:');
    if (!days || isNaN(days)) return;
    
    try {
      const response = await fetch('https://99cap.vercel.app/_/backend/api/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bedId, additionalDays: days })
      });
      if (response.ok) {
        notify(`Stay extended by ${days} days for Bed #${bedId}`, 'success');
        fetchCheckouts();
      }
    } catch (error) {
      notify('Extension failed', 'error');
    }
  };

  const reprintBill = (bed) => {
    const start = new Date(bed.customer.checkIn);
    const end = new Date(bed.customer.checkOut);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    setReceiptData({
      customerName: bed.customer.name,
      bedId: bed.id,
      checkIn: bed.customer.checkIn,
      checkOut: bed.customer.checkOut,
      days: days,
      totalAmount: days * 350
    });
    printBill(bed.customer.name);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFiltered = checkouts
    .filter(bed => 
      bed.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bed.id.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      let valA, valB;
      if (sortConfig.key === 'id') {
        valA = a.id;
        valB = b.id;
      } else if (sortConfig.key === 'days') {
        const startA = new Date(a.customer.checkIn);
        const endA = new Date(a.customer.checkOut);
        valA = Math.ceil((endA - startA) / (1000 * 60 * 60 * 24));
        
        const startB = new Date(b.customer.checkIn);
        const endB = new Date(b.customer.checkOut);
        valB = Math.ceil((endB - startB) / (1000 * 60 * 60 * 24));
      } else {
        valA = a.customer[sortConfig.key];
        valB = b.customer[sortConfig.key];
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const today = new Date().toISOString().split('T')[0];
  const summary = {
    dueToday: checkouts.filter(b => b.customer.checkOut === today).length,
    overstayed: checkouts.filter(b => b.customer.checkOut < today).length
  };

  return (
    <div className="space-y-4 lg:space-y-8 animate-in fade-in duration-700 px-1 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:gap-6">
        <div>
          <h1 className="text-[26px] lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Departures</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-[13px] lg:text-base">Review and manage departing guest records</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-900 rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors">
        {/* Table Controls */}
        <div className="p-4 lg:p-6 border-b border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="relative flex-1 w-full sm:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or bed..." 
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border-none rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button className="flex-1 sm:flex-none p-2.5 lg:p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors border border-slate-100 dark:border-zinc-700 flex items-center justify-center">
              <Filter size={18} />
            </button>
            <button className="flex-1 sm:flex-none p-2.5 lg:p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-indigo-600 transition-colors border border-slate-100 dark:border-zinc-700 flex items-center justify-center">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-zinc-800/50 transition-colors">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-2">Customer <ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-2">Bed # <ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Check-In</th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('checkOut')}>
                  <div className="flex items-center gap-2">Check-Out <ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('days')}>
                  <div className="flex items-center gap-2">Days <ArrowUpDown size={12}/></div>
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">Total Bill</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 transition-colors">
              {sortedAndFiltered.map((bed) => {
                const start = new Date(bed.customer.checkIn);
                const end = new Date(bed.customer.checkOut);
                const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
                const total = days * 350;

                return (
                  <tr key={bed.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                          {bed.customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white transition-colors">{bed.customer.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase transition-colors">Regular Guest</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 rounded-lg font-black text-slate-700 dark:text-zinc-300 text-sm transition-colors">#{bed.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-600 dark:text-zinc-400 transition-colors">{bed.customer.checkIn}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-600 dark:text-zinc-400 transition-colors">{bed.customer.checkOut}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900 dark:text-white transition-colors">{days} Days</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 transition-colors">₹{total}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => reprintBill(bed)}
                          className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                          title="Reprint Bill"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => handleExtendStay(bed.id)}
                          className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Extend Stay"
                        >
                          <Clock size={18} />
                        </button>
                        <button 
                          onClick={() => handleCheckout(bed)}
                          className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white transition-all shadow-sm group-hover:scale-105"
                          title="Process Checkout"
                        >
                          <LogOut size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sortedAndFiltered.length === 0 && !loading && (
                <tr>
                  <td colSpan="8" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300">
                        <CheckCircle2 size={32} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white">All Clear!</p>
                        <p className="text-sm font-bold text-slate-400">No check-outs scheduled for today.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ThermalReceipt data={receiptData} />
      <CheckoutConfirmationModal 
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        data={receiptData} 
        onConfirm={confirmCheckout} 
      />
    </div>
  );
};

export default CheckoutList;
