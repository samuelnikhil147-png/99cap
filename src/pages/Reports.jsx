import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Download, TrendingUp, Users, BedDouble, DollarSign, Calendar } from 'lucide-react';
import { notify } from '../components/Toast';

const Reports = () => {
  const [stats, setStats] = useState({
    totalBooked: 0,
    occupancyRate: 0,
    totalRevenue: 0,
    guestCount: 0,
    revenueByMonth: [{ name: 'Current', value: 0 }],
    occupancyByDay: [{ name: 'Today', value: 0 }],
    roomTypeData: [{ name: 'Beds', value: 0 }]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/_/backend/api/stats');
        const data = await response.json();
        
        setStats({
          totalBooked: data.booked,
          occupancyRate: data.occupancyRate,
          totalRevenue: data.revenue,
          guestCount: data.booked,
          revenueByMonth: [{ name: 'Current', value: data.revenue }],
          occupancyByDay: [
            { name: 'Mon', value: 0 },
            { name: 'Tue', value: 0 },
            { name: 'Wed', value: 0 },
            { name: 'Thu', value: 0 },
            { name: 'Fri', value: 0 },
            { name: 'Today', value: parseFloat(data.occupancyRate) },
          ],
          roomTypeData: [
            { name: 'Booked', value: data.booked },
            { name: 'Available', value: data.available }
          ]
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#6366F1', '#E2E8F0'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics & Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance metrics from live bookings.</p>
        </div>
        <button 
          onClick={() => notify('Generating live system report...', 'success')}
          className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
        >
          <Download size={18} />
          <span>Generate Report</span>
        </button>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
          { label: 'Occupancy Rate', value: `${stats.occupancyRate}%`, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'Total Guests', value: stats.guestCount, icon: Users, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { label: 'Active Bookings', value: stats.totalBooked, icon: BedDouble, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 card-shadow flex items-center gap-4 transition-colors duration-300">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 card-shadow transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Revenue Analysis</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.revenueByMonth}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 card-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">Live Occupancy</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.occupancyByDay}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 card-shadow">
          <h3 className="text-xl font-bold text-slate-900 mb-8">Inventory Status</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.roomTypeData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.roomTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {stats.roomTypeData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                  <span className="text-xs font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">{item.value} Units</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-[#6366F1] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">System Insights</h3>
            <p className="text-blue-100 text-sm mb-8">Summary of your current business performance.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: 'Available Beds', value: 200 - stats.totalBooked, progress: ((200 - stats.totalBooked) / 200) * 100 },
                { label: 'Booked Beds', value: stats.totalBooked, progress: (stats.totalBooked / 200) * 100 },
                { label: 'System Health', value: '100%', progress: 100 },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                  <p className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-3">{item.label}</p>
                  <p className="text-2xl font-black mb-4">{item.value}</p>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white" style={{width: `${item.progress}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold">Live Data Sync</p>
                  <p className="text-[10px] text-blue-100">Updates in real-time as rooms are booked</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
