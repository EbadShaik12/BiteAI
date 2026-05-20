import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Apple, MessageSquare, BarChart3, Dumbbell, Trophy, Droplets, RefreshCw } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  // persistent local storage for daily water hydration tracking
  const [waterLogged, setWaterLogged] = useState(() => {
    const cached = localStorage.getItem('biteai_water_log');
    return cached ? Number(cached) : 0;
  });

  useEffect(() => {
    localStorage.setItem('biteai_water_log', String(waterLogged));
  }, [waterLogged]);

  const waterGoal = 3500; // 3.5 Liters in ml
  const percentCompleted = Math.min(Math.round((waterLogged / waterGoal) * 100), 100);

  const logWater = (amount) => {
    setWaterLogged((prev) => prev + amount);
  };

  const resetWater = () => {
    setWaterLogged(0);
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Scan', path: '/meal-upload', icon: Apple },
    { name: 'AI Coach', path: '/coach', icon: MessageSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Challenges', path: '/social-challenges', icon: Trophy }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Floating Bottom Navigation (Visible on mobile only) */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 px-4 py-3 glass-panel rounded-2xl flex items-center justify-around border border-white/10 shadow-2xl shadow-black/80">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                active 
                  ? 'text-emerald-400 scale-110 text-neon-emerald' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon size={20} className={active ? 'stroke-[2.5]' : 'stroke-[1.8]'} />
              <span className="text-[10px] font-semibold tracking-wider font-heading">{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Desktop Left Sidebar (Visible on desktop screens) */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-white/10 p-6 min-h-[calc(100vh-73px)]">
        <div className="mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 mb-3">Health Protocols</p>
          <div className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  <Icon size={18} className={active ? 'stroke-[2.5] text-emerald-400' : 'stroke-[1.8]'} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Premium Interactive Hydration Protocol Module */}
        <div className="mt-auto p-4 rounded-2xl bg-gradient-to-tr from-cyan-500/5 to-emerald-500/5 border border-white/5 relative overflow-hidden flex flex-col gap-3">
          {/* Neon blue background glow */}
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-500/10 rounded-full filter blur-xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Droplets size={14} className="stroke-[2.2] animate-bounce" />
              <span>AURA Hydration</span>
            </div>
            
            <button 
              onClick={resetWater}
              className="p-1 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-rose-500/15 hover:border-rose-500/20 transition-all cursor-pointer"
              title="Reset today's logs"
            >
              <RefreshCw size={10} />
            </button>
          </div>

          {/* Fluid levels visual metrics */}
          <div className="relative z-10 flex justify-between items-end border-b border-white/5 pb-2">
            <div>
              <p className="text-xl font-black text-white">{(waterLogged / 1000).toFixed(2)}L</p>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Logged of {waterGoal / 1000}L Goal</p>
            </div>
            <div className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/20 text-[9px] text-cyan-400 font-bold tracking-wider">
              {percentCompleted}%
            </div>
          </div>

          {/* Micro Progress Bar dynamic wave */}
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative z-10 border border-white/5">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]" 
              style={{ width: `${percentCompleted}%` }}
            ></div>
          </div>

          {/* Quick hydration log buttons */}
          <div className="grid grid-cols-2 gap-2 relative z-10">
            <button
              onClick={() => logWater(250)}
              className="py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/30 text-[10px] font-bold text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/5 active:scale-[0.96] transition-all cursor-pointer"
            >
              +250ml Glass
            </button>
            <button
              onClick={() => logWater(500)}
              className="py-1.5 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/30 text-[10px] font-bold text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/5 active:scale-[0.96] transition-all cursor-pointer"
            >
              +500ml Bottle
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
