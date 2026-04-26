import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Info, CreditCard, User, BedDouble, Calendar, 
  CheckCircle2, Clock, AlertCircle, ShieldAlert, MapPin, 
  Zap, ShieldCheck, Wallet, Timer, Activity, Users, LogOut 
} from 'lucide-react';
import { notify } from '../components/Toast';
import BedBookingModal from '../components/BedBookingModal';
import CheckoutConfirmationModal from '../components/CheckoutConfirmationModal';
import ThermalReceipt from '../components/ThermalReceipt';
import bedMainImg from '../assets/bed-main.png';

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
    setLoading(true);
    try {
      // 1. Try Local Dummy Data First
      const localResp = await fetch('/dummyData.json');
      if (localResp.ok) {
        const fullData = await localResp.json();
        // Map roomId to id for consistency with component expectations
        const mappedBeds = (fullData.rooms || []).map(r => ({
          ...r,
          id: r.roomNumber // Using roomNumber as the primary ID for the UI
        }));
        setBeds(mappedBeds);
        setLoading(false);
        return;
      }

      // 2. Fallback to Production API
      const response = await fetch('https://99cap.vercel.app/_/backend/api/beds');
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
      const response = await fetch('https://99cap.vercel.app/_/backend/api/extend', {
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
      const response = await fetch('https://99cap.vercel.app/_/backend/api/book', {
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
    Booked: { color: 'navy', icon: User, bg: 'bg-navy-900/10', text: 'text-navy-900', border: 'border-navy-900/20', dot: 'bg-navy-900' },
    'Checkout Due Today': { color: 'amber', icon: AlertCircle, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-800', dot: 'bg-amber-500' },
    Overstayed: { color: 'rose', icon: ShieldAlert, bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-800', dot: 'bg-rose-500' },
    Maintenance: { color: 'grey', icon: Clock, bg: 'bg-grey-100 dark:bg-slate-800/50', text: 'text-grey-400 dark:text-slate-400', border: 'border-grey-200 dark:border-slate-700', dot: 'bg-grey-400' }
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
    <div className="space-y-6 pb-10 animate-in fade-in duration-1000">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-bold text-[#1D1D1F] tracking-tight leading-none">Reception Desk</h1>
          <p className="text-[#86868B] font-medium text-[13px] mt-1.5">Enterprise Management Suite</p>
        </div>

        <div className="flex gap-2">
          {[
            { label: 'Inventory', value: stats.total, color: 'text-[#000000]' },
            { label: 'Available', value: stats.available, color: 'text-[#10B981]' },
            { label: 'Booked', value: stats.active, color: 'text-[#0066CC]' }
          ].map((stat, i) => (
            <div key={i} className="bg-white px-4 h-11 rounded-xl flex items-center gap-3 border border-[#F2F2F2] shadow-sm">
               <span className="text-[11px] font-bold uppercase tracking-wider text-[#86868B]">{stat.label}</span>
               <span className={`text-[17px] font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Controls - Unified Search/Filter */}
      <div className="flex flex-col xl:flex-row gap-6 items-center border-b border-[#F2F2F2]">
        <div className="flex items-center gap-8 self-start">
          {['All', 'Available', 'Booked', 'Maintenance'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`h-12 px-1 text-[14px] font-semibold transition-all duration-300 whitespace-nowrap relative ${
                filterStatus === status 
                ? 'text-[#000000]' 
                : 'text-[#86868B] hover:text-[#000000]'
              }`}
            >
              {status}
              {filterStatus === status && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#000000] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 relative w-full mb-3 xl:mb-0 xl:max-w-md ml-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D2D2D7]" size={16} />
          <input 
            type="text" 
            placeholder="Search records..."
            className="w-full h-10 bg-white border border-[#F2F2F2] rounded-lg pl-10 pr-4 text-[13px] font-medium text-[#1D1D1F] focus:ring-4 focus:ring-[#0066CC]/5 focus:border-[#0066CC] outline-none transition-all duration-300 placeholder-[#D2D2D7] shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Grid - 5 Cards Layout with Tight Gaps */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
           <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#000000] border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
          {filteredBeds.map((bed) => {
            const config = statusConfig[bed.status] || statusConfig.Available;
            const StatusIcon = config.icon;
            
            let stayDuration = 0;
            if (bed.customer?.checkIn && bed.customer?.checkOut) {
              const start = new Date(bed.customer.checkIn);
              const end = new Date(bed.customer.checkOut);
              stayDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            }

            // Professional Badge Styles
            const badgeStyles = {
              Available: 'bg-[#DCFCE7] text-[#16A34A]',
              Booked: 'bg-[#DBEAFE] text-[#2563EB]',
              Maintenance: 'bg-[#FEF3C7] text-[#D97706]'
            }[bed.status] || 'bg-slate-100 text-slate-600';

            return (
              <div
                key={bed.id}
                onClick={() => handleBedClick(bed)}
                className="w-full bg-white rounded-[12px] border border-[#E5E7EB] flex flex-col cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] group overflow-hidden relative shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              >
                {/* 3) Sharp Status Badge */}
                <div className={`absolute top-3 right-3 z-10 h-7 px-2.5 rounded-full text-[12px] font-semibold flex items-center justify-center tracking-tight transition-transform duration-200 group-hover:scale-105 ${badgeStyles}`}>
                  {bed.status}
                </div>

                {/* 4) Image Section (160px) */}
                <div className="h-[160px] relative overflow-hidden bg-[#F9FAFB]">
                  {bed.status === 'Available' ? (
                    <img 
                      src={bedMainImg} 
                      alt="Room" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#F9FAFB]">
                       <BedDouble size={40} className="text-[#E5E7EB]" />
                    </div>
                  )}
                  {/* Subtle Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.04)] pointer-events-none"></div>
                </div>

                {/* 1) Card Content (16px Padding) */}
                <div className="p-4 flex flex-col">
                  {/* 5) Room Name + Price Row */}
                  <div className="flex justify-between items-center gap-2">
                    <h3 className="text-[16px] font-semibold text-[#111827] tracking-tight">Room {bed.id}</h3>
                    <p className="text-[16px] font-semibold text-[#111827]">₹350</p>
                  </div>
                  
                  {/* Status/Duration Secondary Text (12px) */}
                  <div className="mt-3 min-h-[44px]">
                    {bed.status === 'Available' ? (
                      <p className="text-[12px] font-medium text-[#6B7280]">Ready for check-in</p>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <p className="text-[13px] font-bold text-[#111827] truncate">
                            {bed.customer?.name || 'Occupied'}
                          </p>
                          <p className="text-[11px] font-medium text-[#6B7280]">
                            Stay: {stayDuration}d active
                          </p>
                        </div>
                        {bed.status === 'Booked' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCheckout(bed); // Direct checkout & bill
                            }}
                            className="w-full h-8 flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white text-[12px] font-semibold text-[#111827] hover:bg-[#F9FAFB] hover:border-[#111827] transition-all active:scale-95"
                          >
                            <LogOut size={14} />
                            Check Out
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 8) Subtle Divider */}
                  <div className="h-[1px] bg-[#E5E7EB] my-3"></div>

                  {/* 6) Footer Text */}
                  <div className="flex items-center gap-2">
                     <StatusIcon size={12} className="text-[#6B7280]" />
                     <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.04em]">
                        Standard Unit
                     </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* System Information - Enterprise Style */}
      <div className="mt-12 bg-white rounded-xl p-10 border border-[#E5E7EB] shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#0F172A] text-white rounded-lg text-[12px] font-bold uppercase tracking-[0.1em]">
               <ShieldCheck size={16} className="text-[#14B8A6]" />
               <span>Operational Protocol</span>
            </div>
            <h2 className="text-[28px] font-bold text-[#111827] tracking-tight">Management Framework</h2>
            <p className="text-[16px] text-[#6B7280] leading-relaxed max-w-xl font-medium">
              The 99 Capsule Enterprise PMS is a high-availability platform designed for high-volume hospitality desks. 
              Our interface adheres to strict operational standards to ensure zero-error room allocation and guest management.
            </p>
            <div className="flex items-center gap-5 p-6 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] max-w-md group hover:border-[#0F172A] transition-all duration-300">
              <div className="w-12 h-12 bg-[#0F172A] rounded-lg flex items-center justify-center text-white shrink-0 shadow-md transition-transform group-hover:scale-105">
                <MapPin size={24} className="text-[#14B8A6]" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest">Corporate HQ</p>
                <p className="text-[16px] font-bold text-[#111827] mt-1">Opposite ETree Bus Stand, Vijayawada</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] hover:bg-white hover:border-[#0F172A] transition-all group duration-300">
                <div className="w-12 h-12 bg-white rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#0F172A] transition-all group-hover:bg-[#0F172A] group-hover:text-white shadow-sm">
                  <feature.icon size={22} />
                </div>
                <span className="text-[15px] font-bold text-[#6B7280] group-hover:text-[#111827] transition-colors">{feature.label}</span>
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
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">No units matching filters</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Try adjusting your search query or status filter.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilterStatus('All');}}
            className="mt-8 px-8 py-3 bg-navy-900 text-white rounded-2xl font-semibold shadow-xl hover:scale-105 transition-transform"
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
