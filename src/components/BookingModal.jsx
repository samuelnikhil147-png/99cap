import React, { useState } from 'react';
import { X, Sparkles, Calendar, User, Mail, CreditCard, Home } from 'lucide-react';
import { notify } from './Toast';

const BookingModal = ({ isOpen, onClose, preSelectedRoom, onConfirm }) => {
  const [newBooking, setNewBooking] = useState({
    guest: '',
    email: '',
    room: preSelectedRoom || 'Deluxe Twin Bed 2A',
    checkIn: '',
    checkOut: '',
    price: '',
  });

  // Update room if pre-selection changes
  React.useEffect(() => {
    if (preSelectedRoom) {
      setNewBooking(prev => ({ ...prev, room: preSelectedRoom }));
    }
  }, [preSelectedRoom]);

  const loadDemoData = () => {
    setNewBooking({
      guest: 'Mahesh Babu',
      email: 'mahesh.b@demo.com',
      room: preSelectedRoom || 'Presidential Suite 1A',
      checkIn: '2024-08-10',
      checkOut: '2024-08-15',
      price: '45000',
    });
    notify('Form pre-filled with demo data!', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    notify(`Booking confirmed for Room ${newBooking.room}!`, 'success');
    if (onConfirm) onConfirm(newBooking);
    onClose();
    // Reset form
    setNewBooking({
      guest: '',
      email: '',
      room: 'Deluxe Twin Bed 2A',
      checkIn: '',
      checkOut: '',
      price: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 p-8 flex justify-between items-center border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900">New Booking</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Reserve a room for your guest.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={loadDemoData}
              className="bg-blue-50 text-blue-600 p-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-2 text-xs font-bold"
            >
              <Sparkles size={16} />
              <span>Load Demo</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-white text-slate-400 hover:text-slate-600 rounded-xl border border-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Guest Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  required
                  type="text" 
                  placeholder="Enter full name"
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  value={newBooking.guest}
                  onChange={(e) => setNewBooking({...newBooking, guest: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  required
                  type="email" 
                  placeholder="guest@example.com"
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  value={newBooking.email}
                  onChange={(e) => setNewBooking({...newBooking, email: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Check In</label>
              <input 
                required
                type="date" 
                className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                value={newBooking.checkIn}
                onChange={(e) => setNewBooking({...newBooking, checkIn: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Check Out</label>
              <input 
                required
                type="date" 
                className="w-full bg-slate-50 border-none rounded-2xl py-3.5 px-4 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                value={newBooking.checkOut}
                onChange={(e) => setNewBooking({...newBooking, checkOut: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Total Price</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input 
                  required
                  type="number" 
                  placeholder="0.00"
                  className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-9 pr-4 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  value={newBooking.price}
                  onChange={(e) => setNewBooking({...newBooking, price: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Room Selection</label>
            <div className="relative">
               <Home size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
               <select 
                className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 cursor-pointer focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
                value={newBooking.room}
                onChange={(e) => setNewBooking({...newBooking, room: e.target.value})}
              >
                <option value={newBooking.room}>{newBooking.room}</option>
                <option value="Deluxe Twin Bed 2A">Deluxe Twin Bed 2A</option>
                <option value="Deluxe Queen Size 11B">Deluxe Queen Size 11B</option>
                <option value="Deluxe Single Bed 8D">Deluxe Single Bed 8D</option>
                <option value="Luxury King Size 3C">Luxury King Size 3C</option>
                <option value="Presidential Suite 1A">Presidential Suite 1A</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
