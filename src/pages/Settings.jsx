import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Bell, Shield, Globe, CreditCard, Laptop, Save, ChevronRight, Moon, Sun } from 'lucide-react';
import { notify } from '../components/Toast';

const Settings = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('General');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const tabs = [
    { name: 'General', icon: Laptop },
    { name: 'Profile', icon: User },
    { name: 'Notifications', icon: Bell },
    { name: 'Security', icon: Shield },
    { name: 'Billing', icon: CreditCard },
    { name: 'Language', icon: Globe },
  ];

  const handleSave = () => {
    notify('Settings saved successfully!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'General':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#000000] dark:text-white">Dark Mode</p>
                <p className="text-xs text-[#6B7280]">Enable dark theme for the entire dashboard.</p>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-14 h-8 rounded-full transition-all duration-300 relative flex items-center px-1 ${darkMode ? 'bg-[#000000]' : 'bg-zinc-200'}`}
              >
                <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}>
                  {darkMode ? <Moon size={12} className="text-[#000000]" /> : <Sun size={12} className="text-amber-500" />}
                </div>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 block">Hotel Display Name</label>
                <input 
                  type="text" 
                  defaultValue="99 Capsule"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-[#000000] dark:text-white focus:ring-2 focus:ring-[#000000]/10 transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-grey-400 uppercase tracking-widest mb-2 block">Location / Address</label>
                <input 
                  type="text" 
                  defaultValue="Enter Hotel Address"
                  className="w-full bg-grey-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-navy-900/10 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-bold text-[#000000] dark:text-white">Automatic Backup</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#000000]/5 dark:bg-white/5 border border-[#000000]/10 dark:border-white/10 rounded-2xl flex items-center justify-between cursor-pointer">
                   <span className="text-sm font-bold text-[#000000] dark:text-white">Daily Cloud Sync</span>
                   <div className="w-10 h-6 bg-[#000000] dark:bg-[#14B8A6] rounded-full relative shadow-inner transition-colors"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl flex items-center justify-between cursor-pointer">
                   <span className="text-sm font-bold text-[#6B7280]">Local Cache</span>
                   <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full relative"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'Profile':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-6 pb-6 border-b border-zinc-50 dark:border-zinc-800 transition-colors">
                 <div className="relative group">
                   <div className="w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-[#000000]/10 dark:ring-white/10">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" className="w-full h-full object-cover" />
                   </div>
                   <button className="absolute -bottom-2 -right-2 bg-[#000000] dark:bg-[#14B8A6] text-white dark:text-[#000000] p-2 rounded-xl shadow-lg hover:opacity-90 transition-all">
                     <Sun size={14} />
                   </button>
                 </div>
                 <div>
                   <h4 className="text-xl font-bold text-[#000000] dark:text-white">Administrator</h4>
                   <p className="text-sm text-[#6B7280]">System Admin</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 block">Admin Email</label>
                   <input type="email" defaultValue="admin@99capsule.com" className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-[#000000] dark:text-white focus:ring-2 focus:ring-[#000000]/10 transition-all outline-none" />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-grey-400 uppercase tracking-widest mb-2 block">Mobile Number</label>
                   <input type="tel" defaultValue="+91 00000 00000" className="w-full bg-grey-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-navy-900/10 transition-all outline-none" />
                 </div>
              </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
             {[
               { title: 'New Booking Email', desc: 'Receive detailed email for every new guest reservation.' },
               { title: 'SMS Dashboard Alerts', desc: 'Get critical alerts for high-priority suite bookings.' },
               { title: 'Daily Report Summary', desc: 'A summarized PDF sent to your inbox every morning at 8:00 AM.' },
               { title: 'Customer Feedback', desc: 'Real-time updates when a guest leaves a review.' }
             ].map((item, i) => (
               <div key={i} className="flex items-center justify-between p-4 hover:bg-grey-50 rounded-2xl transition-all">
                  <div className="flex-1 pr-4">
                     <p className="text-sm font-bold text-navy-900">{item.title}</p>
                     <p className="text-xs text-grey-400 mt-0.5">{item.desc}</p>
                  </div>
                  <div className="w-12 h-6 bg-navy-900 rounded-full relative flex items-center px-1 cursor-pointer">
                     <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                  </div>
               </div>
             ))}
          </div>
        );

      case 'Security':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="p-6 bg-grey-50 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-navy-900">Two-Factor Authentication</p>
                  <span className="bg-emerald-100 text-emerald-600 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Enabled</span>
                </div>
                <p className="text-xs text-grey-400">Your account is protected by an additional security layer via Google Authenticator.</p>
             </div>
             <div className="space-y-4">
                <button className="w-full py-4 px-6 bg-navy-900 text-white rounded-2xl font-bold hover:bg-navy-950 transition-all flex items-center justify-between group">
                   <span>Change Management Password</span>
                   <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full py-4 px-6 bg-white border border-grey-200 text-grey-400 rounded-2xl font-bold hover:bg-grey-50 transition-all flex items-center justify-between group">
                   <span>Review Active Sessions</span>
                   <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>
        );

      case 'Billing':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="p-8 bg-navy-900 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-xs font-bold text-grey-300 uppercase tracking-widest mb-1">Current Plan</p>
                  <h4 className="text-3xl font-black mb-6">Pro Enterprise <span className="text-sm font-normal opacity-70">/ ₹14,999/mo</span></h4>
                  <div className="flex gap-4">
                     <button className="bg-white text-navy-900 px-6 py-2 rounded-xl text-xs font-black shadow-lg">Upgrade</button>
                     <button className="bg-navy-800 text-white px-6 py-2 rounded-xl text-xs font-black">View Usage</button>
                  </div>
                </div>
                <CreditCard className="absolute -bottom-10 -right-10 text-white opacity-10 w-48 h-48" />
             </div>
             <div className="space-y-4">
                <p className="text-xs font-bold text-grey-400 uppercase tracking-widest ml-1">Payment Method</p>
                <div className="p-4 border border-grey-100 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-navy-950 rounded flex items-center justify-center font-bold text-white text-[8px]">VISA</div>
                      <span className="text-sm font-bold text-navy-900">•••• 8912</span>
                   </div>
                   <button className="text-navy-900 text-xs font-bold hover:underline">Edit</button>
                </div>
             </div>
          </div>
        );

      case 'Language':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-grey-400 uppercase tracking-widest mb-2 block">System Language</label>
                  <select className="w-full bg-grey-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-navy-900/10 outline-none appearance-none cursor-pointer">
                     <option>English (US / UK)</option>
                     <option>Hindi (हिंदी)</option>
                     <option>Telugu (తెలుగు)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-grey-400 uppercase tracking-widest mb-2 block">Timezone</label>
                  <select className="w-full bg-grey-50 border-none rounded-2xl py-3.5 px-4 text-sm font-bold text-navy-900 focus:ring-2 focus:ring-navy-900/10 outline-none appearance-none cursor-pointer">
                     <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                     <option>(GMT+00:00) UTC Standard Time</option>
                  </select>
                </div>
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-bold text-[#000000] dark:text-white tracking-tight">System Settings</h1>
        <p className="text-[#6B7280] dark:text-zinc-400 mt-1 transition-colors">Manage your hotel dashboard preferences and account.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                activeTab === tab.name 
                ? 'bg-[#000000] text-white shadow-xl shadow-black/10 active:scale-95' 
                : 'text-[#6B7280] hover:bg-[#F3F4F6] dark:hover:bg-zinc-800 hover:text-[#000000] dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon size={20} className="shrink-0" />
                <span className="text-sm font-bold">{tab.name}</span>
              </div>
              {activeTab !== tab.name && <ChevronRight size={16} className="text-[#D1D5DB] shrink-0" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-[#000000] rounded-[2.5rem] border border-grey-100 dark:border-zinc-800 card-shadow overflow-hidden flex flex-col min-h-[500px] transition-colors duration-300">
            <div className="p-8 border-b border-grey-50 dark:border-zinc-800 transition-colors">
              <h3 className="text-xl font-bold text-[#000000] dark:text-white transition-colors">{activeTab} Settings</h3>
              <p className="text-sm text-[#6B7280] dark:text-zinc-400 mt-1 transition-colors">Configure your {activeTab.toLowerCase()} preferences here.</p>
            </div>

            <div className="p-8 flex-1">
              {renderTabContent()}
            </div>

            <div className="p-8 bg-grey-50/50 dark:bg-zinc-800/30 flex items-center justify-between border-t border-grey-50 dark:border-zinc-800 transition-colors">
              <p className="text-xs text-[#6B7280] dark:text-zinc-500 transition-colors">Last saved on April 20, 2024 at 14:45 PM</p>
              <button 
                onClick={handleSave}
                className="bg-[#000000] dark:bg-white text-white dark:text-[#000000] px-8 py-3 rounded-2xl font-bold shadow-lg shadow-black/20 hover:bg-[#14B8A6] dark:hover:bg-[#14B8A6] dark:hover:text-white transition-all flex items-center gap-2 active:scale-95"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          <div className="bg-rose-50 dark:bg-rose-900/10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-rose-900 dark:text-rose-400">Danger Zone</h4>
              <p className="text-sm text-rose-700 dark:text-rose-500 mt-1">Reset system settings or delete historical data.</p>
            </div>
            <button className="px-6 py-3 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all active:scale-95">
              Advanced Actions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
