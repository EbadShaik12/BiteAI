import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Apple, MessageSquare, BarChart3, Dumbbell, Trophy } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

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

        {/* Motivational Bio-Metrics Card */}
        <div className="mt-auto p-4 rounded-xl bg-gradient-to-tr from-emerald-500/5 to-cyan-500/5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-xl -mr-8 -mt-8"></div>
          <p className="text-xs font-bold text-emerald-400 mb-1">AURA BIOMETRICS</p>
          <h4 className="text-xs text-gray-400 font-semibold leading-relaxed">
            "Neural link active. Metabolic rate calibrated. Fuel efficiently, Champion."
          </h4>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
