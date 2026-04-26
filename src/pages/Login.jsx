import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, UserCircle2 } from 'lucide-react';
import { notify } from '../components/Toast';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      // Use relative path for production (Vercel) or localhost for local dev
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api/login' 
        : '/_/backend/api/login';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword })
      });
      const data = await response.json();
      if (response.ok) {
        notify(`Welcome back, ${data.username}!`, 'success');
        localStorage.setItem('user', JSON.stringify(data));
        onLogin(data);
      } else {
        if (response.status === 401) {
          notify('Invalid credentials! Please check your username and password.', 'error');
        } else {
          notify(data.error || 'Login failed. Please try again.', 'error');
        }
      }
    } catch (error) {
      notify('Network Error! Cannot connect to the server. Please check your internet.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="w-28 h-28 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl overflow-hidden">
            <img src="/logo.png" alt="99 Capsule Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">99 Capsule</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-white dark:border-slate-800 animate-in zoom-in-95 duration-500">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Sign In</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Enter your credentials to manage the reservation system.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  required
                  type="text" 
                  placeholder="staff or admin"
                  className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-[#000000] dark:focus:border-white transition-all outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#000000] dark:group-focus-within:text-white transition-colors" />
                <input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="w-full h-14 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-black/5 dark:focus:ring-white/5 focus:border-[#000000] dark:focus:border-white transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#000000] dark:bg-white text-white dark:text-[#000000] rounded-2xl font-black shadow-xl shadow-black/10 dark:shadow-none hover:bg-[#14B8A6] dark:hover:bg-[#14B8A6] dark:hover:text-white active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>


        </div>

        <p className="text-center mt-8 text-slate-400 dark:text-slate-600 text-xs font-medium">
          &copy; 2026 99 Capsule. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
