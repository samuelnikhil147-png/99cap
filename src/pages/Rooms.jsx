import React, { useState } from 'react';
import roomsDataInitial from '../data/rooms.json';
import { Search, Filter, Plus, Grid, List, MoreVertical, CheckCircle2, AlertCircle, Clock, X, Sparkles } from 'lucide-react';
import { notify } from '../components/Toast';

const Rooms = () => {
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([
    ...roomsDataInitial.map(r => ({ ...r, status: r.id % 3 === 0 ? 'Occupied' : 'Available' })),
    {
      id: 6,
      name: "Luxury Suite 4B",
      type: "Suite",
      price: 450,
      image: "https://images.unsplash.com/photo-1591088398332-8a77d3996166?auto=format&fit=crop&q=80&w=800",
      facilities: ["TV", "WiFi", "AC", "Coffee Maker"],
      status: "Available"
    },
    {
      id: 7,
      name: "Standard Twin 2C",
      type: "Deluxe",
      price: 180,
      image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
      facilities: ["WiFi", "Shower"],
      status: "Maintenance"
    }
  ]);

  const [newRoom, setNewRoom] = useState({
    name: '',
    type: 'Deluxe',
    price: '',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    facilities: 'WiFi, TV, AC',
  });

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'All' || room.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Available': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'Occupied': return <Clock className="text-amber-500" size={16} />;
      case 'Maintenance': return <AlertCircle className="text-rose-500" size={16} />;
      default: return <CheckCircle2 className="text-emerald-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
      case 'Occupied': return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
      case 'Maintenance': return 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/50';
      default: return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
    }
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    const room = {
      ...newRoom,
      id: Date.now(),
      price: parseFloat(newRoom.price),
      facilities: newRoom.facilities.split(',').map(f => f.trim()),
      status: 'Available'
    };
    setRooms([room, ...rooms]);
    setIsModalOpen(false);
    setNewRoom({
      name: '',
      type: 'Deluxe',
      price: '',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
      facilities: 'WiFi, TV, AC',
    });
    notify('New room added successfully!');
  };

  const loadDemoData = () => {
    setNewRoom({
      name: 'Presidential Suite VVIP',
      type: 'Presidential',
      price: '1200',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800',
      facilities: 'Private Pool, Jacuzzi, Mini Bar, WiFi, 24/7 Service'
    });
    notify('Form pre-filled with demo data!', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Room Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and monitor all room statuses across the property.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Add New Room</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 card-shadow transition-colors duration-300">
        <div className="flex flex-col lg:flex-row gap-6 justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by room name or type..." 
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        
          <div className="flex bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-xl transition-all ${view === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <Grid size={18} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-xl transition-all ${view === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <List size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Filter size={16} className="text-slate-400" />
            <select 
              className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-0 cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option>All</option>
              <option>Deluxe</option>
              <option>Suite</option>
              <option>Standard</option>
            </select>
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div key={room.id} className="group bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden card-shadow hover:translate-y-[-8px] transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-lg ${getStatusColor(room.status)}`}>
                    {getStatusIcon(room.status)}
                    <span className="text-[10px] font-black uppercase tracking-wider">{room.status}</span>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mb-1">{room.type}</p>
                  <h3 className="text-white text-xl font-black">{room.name}</h3>
                </div>
              </div>

              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-8">
                  {room.facilities.map((facility, i) => (
                    <span key={i} className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-slate-100 dark:border-slate-700">
                      {facility}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Starting from</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">₹{room.price}<span className="text-xs font-bold text-slate-400 ml-1">/night</span></p>
                  </div>
                  <button 
                    onClick={() => notify('Booking process initiated for ' + room.name, 'success')}
                    className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden card-shadow transition-colors duration-300">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room Info</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{room.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{room.type}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusColor(room.status)}`}>
                      {getStatusIcon(room.status)}
                      {room.status}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-black text-slate-900 dark:text-white">₹{room.price}</span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Add Room</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Configure a new hotel room.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={loadDemoData}
                  className="p-3 bg-white dark:bg-slate-800 text-amber-500 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                  title="Load demo data"
                >
                  <Sparkles size={20} />
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-white dark:bg-slate-800 text-slate-400 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddRoom} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Luxury Suite 5A" 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    value={newRoom.name}
                    onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Type</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer"
                    value={newRoom.type}
                    onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                  >
                    <option>Deluxe</option>
                    <option>Suite</option>
                    <option>Presidential</option>
                    <option>Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price per Night (₹)</label>
                  <input 
                    required
                    type="number" 
                    placeholder="350" 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    value={newRoom.price}
                    onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Image URL</label>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    value={newRoom.image}
                    onChange={(e) => setNewRoom({...newRoom, image: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Facilities (comma separated)</label>
                <textarea 
                  rows="3"
                  placeholder="WiFi, TV, AC, Coffee Maker..." 
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                  value={newRoom.facilities}
                  onChange={(e) => setNewRoom({...newRoom, facilities: e.target.value})}
                ></textarea>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 px-12 rounded-2xl bg-indigo-600 text-white font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
