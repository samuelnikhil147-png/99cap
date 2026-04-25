import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Info, CreditCard, User, BedDouble, Calendar, 
  CheckCircle2, Clock, AlertCircle, ShieldAlert, MapPin, 
  Zap, ShieldCheck, Wallet, Timer, Activity, Users 
} from 'lucide-react';
import { notify } from '../components/Toast';
import BedBookingModal from '../components/BedBookingModal';
import CheckoutConfirmationModal from '../components/CheckoutConfirmationModal';
import ThermalReceipt from '../components/ThermalReceipt';

const Dashboard = () => {
  const [beds, setBeds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
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

  const fetchBeds = async () => {
    try {
      const response = await fetch('/api/beds');
      const data = await response.json();
      setBeds(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching beds:', error);
      notify('Failed to connect to server', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
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
      const response = await fetch('/api/checkout', {
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
          fetchBeds();
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
      const response = await fetch('/api/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bedId, additionalDays: days })
      });
      if (response.ok) {
        notify(`Stay extended by ${days} days for Bed #${bedId}`, 'success');
        fetchBeds();
      }
    } catch (error) {
      notify('Extension failed', 'error');
    }
  };

  const handleBedClick = (bed) => {
    if (bed.status === 'Available') {
      setSelectedBed(bed.id);
      setIsModalOpen(true);
    } else if (['Booked', 'Checkout Due Today', 'Overstayed'].includes(bed.status)) {
      // Logic for extension/checkout handled via card buttons
    } else if (bed.status === 'Maintenance') {
      notify(`Bed #${bed.id} is under maintenance.`, 'warning');
    }
  };

  const handleBookingConfirm = async (bedId, customerDetails) => {
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bedId, customer: customerDetails })
      });

      if (response.ok) {
        notify(`Bed #${bedId} booked successfully!`, 'success');
        fetchBeds(); 
      } else {
        const err = await response.json();
        notify(err.error || 'Booking failed', 'error');
      }
    } catch (error) {
      notify('Server connection failed', 'error');
    }
  };

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.id.toString().includes(searchTerm) || 
                         (bed.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || bed.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'Available').length,
    active: beds.filter(b => ['Booked', 'Checkout Due Today', 'Overstayed'].includes(b.status)).length,
  };

  const statusConfig = {
    Available: { color: 'emerald', icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-800', dot: 'bg-emerald-500' },
    Booked: { color: 'indigo', icon: User, bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-800', dot: 'bg-indigo-500' },
    'Checkout Due Today': { color: 'amber', icon: AlertCircle, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800', dot: 'bg-amber-500' },
    Overstayed: { color: 'rose', icon: ShieldAlert, bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-800', dot: 'bg-rose-500' },
    Maintenance: { color: 'slate', icon: Clock, bg: 'bg-slate-50 dark:bg-slate-800/50', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-100 dark:border-slate-700', dot: 'bg-slate-500' }
  };

  const todayCheckouts = beds.filter(b => ['Checkout Due Today', 'Overstayed'].includes(b.status));

  const features = [
    { icon: BedDouble, label: "Capsule-style individual beds" },
    { icon: Timer, label: "Short stay accommodation" },
    { icon: Users, label: "Suitable for travelers & commuters" },
    { icon: Wallet, label: "Budget-friendly lodging" },
    { icon: Zap, label: "Quick rest near transport hubs" },
    { icon: Activity, label: "24/7 availability" },
    { icon: ShieldCheck, label: "Clean and secure environment" }
  ];

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* Header & Stats - Compact */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Reception Desk</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Internal Reservation & Availability System</p>
        </div>

        <div className="flex gap-2">
          {[
            { label: 'ALL', value: stats.total, bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300' },
            { label: 'AVAIL', value: stats.available, bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
            { label: 'BOOKED', value: stats.booked, bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-400' },
            { label: 'MAINT', value: stats.maintenance, bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' }
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} ${stat.text} px-4 py-2 rounded-xl flex items-center gap-3 border border-white/50 dark:border-slate-700/50 shadow-sm transition-colors duration-300`}>
               <span className="text-[10px] font-black uppercase tracking-wider">{stat.label}</span>
               <span className="text-lg font-black leading-none">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Control Bar - Compact */}
      <div className="flex flex-col xl:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Quick search (Number/Guest)..."
            className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-slate-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-full xl:w-auto overflow-x-auto no-scrollbar transition-colors duration-300">
          {['All', 'Available', 'Booked', 'Reserved', 'Maintenance'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all whitespace-nowrap ${
                filterStatus === status 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-600' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid - High Density */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
           <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
          {filteredBeds.map((bed) => {
            const config = statusConfig[bed.status] || statusConfig.Available;
            const StatusIcon = config.icon;
            
            // Calculate stay duration for booked beds
            let stayDuration = 0;
            if (bed.customer?.checkIn && bed.customer?.checkOut) {
              const start = new Date(bed.customer.checkIn);
              const end = new Date(bed.customer.checkOut);
              stayDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            }

            return (
              <div
                key={bed.id}
                onClick={() => handleBedClick(bed)}
                className={`
                  relative group cursor-pointer bg-white dark:bg-slate-900 p-4 rounded-[2rem] border-2 transition-all duration-300
                  ${config.border} hover:shadow-xl hover:-translate-y-1
                  ${bed.status === 'Available' ? 'hover:border-emerald-300 dark:hover:border-emerald-700' : ''}
                `}
              >
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg ${config.bg} ${config.text} border ${config.border} transition-colors`}>
                  <StatusIcon size={12} />
                </div>

                <div className="mb-4">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none">#{bed.id}</h3>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter mt-1">Bed Number</p>
                </div>

                <div className="space-y-3 mb-4 min-h-[60px]">
                  {bed.status === 'Available' ? (
                    <div>
                      <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase">Premium Unit</p>
                      <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Single Occupancy</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] font-black text-slate-900 dark:text-white truncate">{bed.customer?.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={8} className="text-slate-400" />
                        <p className="text-[8px] font-bold text-slate-500 dark:text-slate-400 uppercase">{stayDuration} Days Stay</p>
                      </div>
                    </div>
                  )}
                </div>

                {['Booked', 'Checkout Due Today', 'Overstayed'].includes(bed.status) && (
                  <div className="flex gap-1 mt-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleExtendStay(bed.id); }}
                      className="flex-1 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[8px] font-black uppercase hover:bg-indigo-100 transition-colors"
                    >
                      Extend
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCheckout(bed); }}
                      className="flex-1 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-[8px] font-black uppercase hover:bg-rose-100 transition-colors"
                    >
                      Out
                    </button>
                  </div>
                )}

                {bed.status === 'Available' && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                    <div>
                      <span className="text-[7px] font-bold text-slate-400 dark:text-slate-500 block leading-none uppercase">Rate</span>
                      <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none mt-0.5">₹350</p>
                    </div>
                    <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <CreditCard size={12} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* About Section */}
      <div className="mt-12 bg-indigo-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-indigo-100 dark:border-slate-800 p-8 xl:p-12 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20">
              <Info size={14} />
              <span>System Information</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">What is 99 Capsule?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
              99 Capsule is a capsule-style stay and dormitory accommodation designed for short-term stays. 
              It is ideal for travelers, commuters, and individuals looking for affordable and convenient lodging near transport hubs.
            </p>
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-3xl border border-indigo-50 dark:border-slate-700 shadow-sm max-w-md">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Location</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Opposite ETree Bus Stand, Vijayawada</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-indigo-50/50 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all group">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <feature.icon size={20} />
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredBeds.length === 0 && !loading && (
        <div className="py-40 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={40} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">No units matching filters</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Try adjusting your search query or status filter.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilterStatus('All');}}
            className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 hover:scale-105 transition-transform"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Modals */}
      <BedBookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedBed={selectedBed}
        onConfirm={handleBookingConfirm}
      />
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

export default Dashboard;
