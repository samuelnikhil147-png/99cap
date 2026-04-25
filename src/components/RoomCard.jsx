import React from 'react';
import { Wifi, Tv, Wind, ShowerHead as Shower, Coffee, Bath } from 'lucide-react';

const iconsMapping = {
  WiFi: Wifi,
  TV: Tv,
  AC: Wind,
  Shower: Shower,
  "Mini Bar": Coffee,
  Jacuzzi: Bath,
};

const RoomCard = ({ room }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow transition-all duration-300 hover:translate-y-[-4px] group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={room.image} 
          alt={room.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {room.badge && (
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg ${room.badge === 'Hot' ? 'bg-orange-500' : 'bg-blue-500'}`}>
            {room.badge}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{room.name}</h3>
            <p className="text-xs text-slate-500">{room.type}</p>
          </div>
          <p className="text-lg font-bold text-blue-600">
            ₹{room.price}<span className="text-[10px] text-slate-400 font-normal">/night</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 mb-6">
          {room.facilities.map((fac) => {
            const Icon = iconsMapping[fac] || Wifi;
            return (
              <div key={fac} className="flex items-center gap-1 text-slate-500" title={fac}>
                <Icon size={14} className="text-slate-400" />
                <span className="text-[10px] font-medium">{fac}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button className="flex-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Room Detail
          </button>
          <button className="flex-[2] bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:shadow-blue-600/30">
            Make Reservation
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
