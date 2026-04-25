import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Star, Phone, MapPin, Calendar, CreditCard, X, Hash } from 'lucide-react';
import { notify } from '../components/Toast';

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/_/backend/api/customers');
        if (!response.ok) throw new Error('Failed to fetch customers');
        const data = await response.json();
        
        const mappedCustomers = data.map(c => ({
          ...c,
          id: `C-${c.bedId}-${Date.now()}`,
          avatar: `https://ui-avatars.com/_/backend/api/?name=${encodeURIComponent(c.name)}&background=random&color=fff&size=128`
        }));
        
        setCustomers(mappedCustomers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        notify('Failed to load customers', 'error');
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery) ||
    c.bedId.toString().includes(searchQuery)
  );

  const CustomerDetailsModal = ({ customer, onClose }) => {
    if (!customer) return null;
    
    const start = new Date(customer.checkIn);
    const end = new Date(customer.checkOut);
    const stayDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Booking Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
                <img src={customer.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{customer.name}</h3>
                <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase mt-2">
                  Bed Number #{customer.bedId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stay Duration</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{stayDays} Days</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Bill</p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">₹{stayDays * 350}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Contact</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">+91 {customer.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <CreditCard size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Aadhaar ID</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{customer.aadhar}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Address</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{customer.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 dark:bg-slate-800/50 flex gap-4">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-white rounded-2xl font-bold shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Customer Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time guest database from active bookings.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 card-shadow transition-colors duration-300">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or room number..." 
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="group bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 card-shadow p-6 hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-700 border-4 border-white dark:border-slate-800 shadow-lg">
                  <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-lg text-[10px] font-bold border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm">
                  {customer.status}
                </div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-2xl flex items-center gap-2">
                <Hash size={14} />
                <span className="text-sm font-black">Room {customer.bedId}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{customer.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Verified Guest</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Phone size={16} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-bold">+91 {customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <MapPin size={16} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium">{customer.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Calendar size={16} className="shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-medium">Check-in: {customer.checkIn}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 pt-6 border-t border-slate-50 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Aadhaar Number</p>
                <span className="text-xs font-black text-slate-900 dark:text-white">{customer.aadhar}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setSelectedCustomer(customer)}
              className="w-full mt-6 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all transform group-hover:scale-[1.02]"
            >
              View Booking Details
            </button>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">No customers found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try searching by name, phone, or room number.</p>
        </div>
      )}

      <CustomerDetailsModal 
        customer={selectedCustomer} 
        onClose={() => setSelectedCustomer(null)} 
      />
    </div>
  );
};

export default Customers;
