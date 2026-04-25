import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BedDouble, Calendar, DollarSign, ArrowUpRight, ArrowDownRight, Filter, Download, Receipt, PieChart, Activity } from 'lucide-react';
import { notify } from '../components/Toast';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/admin/analytics');
        const statsData = await statsRes.json();
        setStats(statsData);

        const billsRes = await fetch('/api/admin/bills');
        const billsData = await billsRes.json();
        setBills(billsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white">
          {typeof value === 'number' && title.includes('Sales') ? `₹${value.toLocaleString()}` : value}
        </h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Admin Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-1 uppercase tracking-widest text-[10px]">Real-time operational & financial tracking</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black text-sm border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Filter size={18} />
            Filters
          </button>
          <button className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 flex items-center gap-2 hover:bg-indigo-700 transition-all">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Today Sales" value={stats.todayRevenue} icon={DollarSign} color="bg-emerald-500" trend={12} />
        <StatCard title="Monthly Sales" value={stats.monthlyRevenue} icon={TrendingUp} color="bg-indigo-500" trend={8} />
        <StatCard title="Today Checkouts" value={stats.todayCheckouts} icon={Users} color="bg-amber-500" />
        <StatCard title="Occupancy Rate" value={`${Math.round((stats.booked / stats.totalBeds) * 100)}%`} icon={BedDouble} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bills Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Recent Bills History</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complete list of all transactions</p>
            </div>
            <Receipt className="text-slate-300" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bed</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {bills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
                          {bill.customerName.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{bill.customerName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-600 dark:text-slate-400 text-xs">Bed #{bill.bedId}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-black uppercase">
                        {bill.stayedDays} Days
                      </span>
                    </td>
                    <td className="px-8 py-5 font-black text-indigo-600 dark:text-indigo-400">₹{bill.totalAmount}</td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-400">{new Date(bill.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Occupancy Chart Placeholder */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
                <PieChart size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">Occupancy Overview</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Bed utilization summary</p>
              </div>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Available', count: stats.available, total: stats.totalBeds, color: 'bg-emerald-500' },
                { label: 'Booked', count: stats.booked, total: stats.totalBeds, color: 'bg-indigo-500' },
                { label: 'Maintenance', count: stats.maintenance, total: stats.totalBeds, color: 'bg-rose-500' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-slate-900 dark:text-white">{item.count} Beds</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.color} rounded-full`} 
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-600/30 relative overflow-hidden group">
            <Activity className="absolute -right-4 -bottom-4 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-xl font-black mb-2 relative z-10">Sales Goal</h3>
            <p className="text-indigo-100 text-xs font-medium mb-8 relative z-10">Monthly revenue target track</p>
            <div className="flex items-end justify-between mb-4 relative z-10">
              <span className="text-3xl font-black">75%</span>
              <span className="text-xs font-bold text-indigo-200">₹42,000 / ₹56,000</span>
            </div>
            <div className="h-3 w-full bg-indigo-500 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-white rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
