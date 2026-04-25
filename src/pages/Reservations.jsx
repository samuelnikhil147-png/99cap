import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, Download, Filter, MoreHorizontal, User, Mail, Phone, Clock, X, Sparkles } from 'lucide-react';
import { notify } from '../components/Toast';

const Reservations = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservations, setReservations] = useState([
    { id: '#RES-8829', guest: 'Sarah Wilson', email: 'sarah.w@example.com', room: 'Deluxe Queen 11B', checkIn: '2024-07-24', checkOut: '2024-07-27', status: 'Confirmed', price: 7020 },
    { id: '#RES-8830', guest: 'Michael Chen', email: 'm.chen@example.com', room: 'Luxury King 3C', checkIn: '2024-07-25', checkOut: '2024-07-26', status: 'Pending', price: 3500 },
    { id: '#RES-8831', guest: 'Emma Rodriguez', email: 'emma.r@example.com', room: 'Standard Twin 4A', checkIn: '2024-07-26', checkOut: '2024-07-30', status: 'Cancelled', price: 4400 },
    { id: '#RES-8832', guest: 'James Taylor', email: 'j.taylor@example.com', room: 'Presidential Suite 1A', checkIn: '2024-07-27', checkOut: '2024-08-02', status: 'Confirmed', price: 33000 },
    { id: '#RES-8833', guest: 'Olivia Brown', email: 'olivia.b@example.com', room: 'Deluxe Single 8D', checkIn: '2024-07-28', checkOut: '2024-07-29', status: 'Confirmed', price: 2010 },
    { id: '#RES-8834', guest: 'Daniel Kim', email: 'd.kim@example.com', room: 'Suite 5E', checkIn: '2024-07-29', checkOut: '2024-08-01', status: 'Pending', price: 8970 },
    { id: '#RES-8835', guest: 'Amit Sharma', email: 'amit.s@example.com', room: 'Deluxe Twin 2A', checkIn: '2024-08-01', checkOut: '2024-08-03', status: 'Confirmed', price: 5400 },
    { id: '#RES-8836', guest: 'Priya Das', email: 'priya.d@example.com', room: 'Luxury King 3B', checkIn: '2024-08-02', checkOut: '2024-08-05', status: 'Pending', price: 12000 },
    { id: '#RES-8837', guest: 'Suresh Raina', email: 'suresh.r@example.com', room: 'Standard Single 1C', checkIn: '2024-08-03', checkOut: '2024-08-04', status: 'Confirmed', price: 1500 },
  ]);

  const today = new Date().toISOString().split('T')[0];
  const getNextDay = (dateStr) => {
    const d = new Date(dateStr || today);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [dateErrors, setDateErrors] = useState({});

  const [newBooking, setNewBooking] = useState({
    guest: '',
    email: '',
    room: 'Deluxe Twin Bed 2A',
    checkIn: today,
    checkOut: getNextDay(today),
    price: '',
  });

  const handleDateChange = (field, value) => {
    const updated = { ...newBooking, [field]: value };
    const errors = { ...dateErrors };

    if (field === 'checkIn') {
      if (value < today) {
        errors.checkIn = "Check-In cannot be in the past";
      } else {
        delete errors.checkIn;
      }
      
      if (updated.checkOut <= value) {
        updated.checkOut = getNextDay(value);
        delete errors.checkOut;
      }
    }

    if (field === 'checkOut') {
      if (value <= updated.checkIn) {
        errors.checkOut = "Check-Out must be after Check-In";
        setTimeout(() => {
          setNewBooking(prev => ({ ...prev, checkOut: getNextDay(prev.checkIn) }));
          setDateErrors(prev => {
            const e = { ...prev };
            delete e.checkOut;
            return e;
          });
        }, 1500);
      } else {
        delete errors.checkOut;
      }
    }

    setNewBooking(updated);
    setDateErrors(errors);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
      case 'Pending': return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
      case 'Cancelled': return 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/50';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-100 dark:border-slate-800';
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.guest.toLowerCase().includes(searchQuery.toLowerCase()) || res.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' || res.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBooking = (e) => {
    e.preventDefault();
    if (newBooking.checkIn < today || newBooking.checkOut <= newBooking.checkIn) {
      notify('Invalid dates provided', 'error');
      return;
    }

    const id = `#RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const booking = {
      ...newBooking,
      id,
      status: 'Pending',
      price: parseFloat(newBooking.price) || 0
    };
    setReservations([booking, ...reservations]);
    setIsModalOpen(false);
    setNewBooking({
      guest: '',
      email: '',
      room: 'Deluxe Twin Bed 2A',
      checkIn: today,
      checkOut: getNextDay(today),
      price: '',
    });
    setDateErrors({});
  };

  const loadDemoData = () => {
    const ci = '2024-08-10';
    setNewBooking({
      guest: 'Mahesh Babu',
      email: 'mahesh.b@demo.com',
      room: 'Presidential Suite 1A',
      checkIn: ci,
      checkOut: getNextDay(ci),
      price: '45000',
    });
    setDateErrors({});
    notify('Form pre-filled with demo data!', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Reservations</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor and manage all guest bookings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => notify('Exporting reservations to CSV...', 'success')}
            className="bg-white dark:bg-slate-800 text-slate-600 dark:text-white px-4 py-3 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95"
          >
            <Calendar size={18} />
            <span>New Booking</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: reservations.length.toLocaleString(), change: '+12%', color: 'blue' },
          { label: 'Confirmed', value: reservations.filter(r => r.status === 'Confirmed').length, change: '+8%', color: 'emerald' },
          { label: 'Pending', value: reservations.filter(r => r.status === 'Pending').length, change: '-3%', color: 'amber' },
          { label: 'Cancelled', value: reservations.filter(r => r.status === 'Cancelled').length, change: '+1%', color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 card-shadow">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-end justify-between mt-4">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 card-shadow transition-colors duration-300">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by guest name or reservation ID..." 
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <Filter size={16} className="text-slate-400" />
              <select 
                className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-0 cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>All</option>
                <option>Confirmed</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden card-shadow transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check In/Out</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">{res.guest}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{res.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{res.room}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{res.checkIn}</span>
                      <span className="text-[10px] text-slate-400">to {res.checkOut}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(res.status)}`}>
                      {res.status}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-black text-slate-900 dark:text-white">₹{res.price}</span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">New Booking</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Fill in the details to create a new reservation.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={loadDemoData}
                  className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-3 rounded-2xl border border-amber-100 dark:border-amber-900/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all flex items-center gap-2 text-xs font-bold"
                >
                  <Sparkles size={20} />
                  <span>Load Demo</span>
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-white dark:bg-slate-800 text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreateBooking} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Guest Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Enter full name"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                    value={newBooking.guest}
                    onChange={(e) => setNewBooking({...newBooking, guest: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="guest@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                    value={newBooking.email}
                    onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Check In</label>
                  <input 
                    required
                    type="date" 
                    min={today}
                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none ${dateErrors.checkIn ? 'ring-2 ring-red-500' : ''}`}
                    value={newBooking.checkIn}
                    onChange={(e) => handleDateChange('checkIn', e.target.value)}
                  />
                  {dateErrors.checkIn && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{dateErrors.checkIn}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Check Out</label>
                  <input 
                    required
                    type="date" 
                    min={getNextDay(newBooking.checkIn)}
                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none ${dateErrors.checkOut ? 'ring-2 ring-red-500' : ''}`}
                    value={newBooking.checkOut}
                    onChange={(e) => handleDateChange('checkOut', e.target.value)}
                  />
                  {dateErrors.checkOut && <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{dateErrors.checkOut}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input 
                      required
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 pl-8 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                      value={newBooking.price}
                      onChange={(e) => setNewBooking({...newBooking, price: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Selection</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={newBooking.room}
                  onChange={(e) => setNewBooking({...newBooking, room: e.target.value})}
                >
                  <option value="Deluxe Twin Bed 2A">Deluxe Twin Bed 2A</option>
                  <option value="Deluxe Queen Size 11B">Deluxe Queen Size 11B</option>
                  <option value="Deluxe Single Bed 8D">Deluxe Single Bed 8D</option>
                  <option value="Luxury King Size 3C">Luxury King Size 3C</option>
                  <option value="Presidential Suite 1A">Presidential Suite 1A</option>
                </select>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] px-6 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;
