import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { Activity, Flame, LogOut, MessageSquare, Apple, BarChart2, Dumbbell, Trophy } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent';
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
          <Activity size={20} className="stroke-[2.5]" />
        </div>
        <span className="font-heading font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-400 group-hover:text-emerald-400 transition-colors">
          BITE<span className="text-emerald-400 text-neon-emerald">AI</span>
        </span>
      </Link>

      {/* Action links */}
      {token && (
        <div className="hidden lg:flex items-center gap-1">
          <Link to="/dashboard" className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
          <Link to="/meal-upload" className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isActive('/meal-upload')}`}>
            AI Scan & Log
          </Link>
          <Link to="/coach" className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isActive('/coach')}`}>
            AI Coach
          </Link>
          <Link to="/analytics" className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isActive('/analytics')}`}>
            Bio-Analytics
          </Link>
          <Link to="/workouts" className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isActive('/workouts')}`}>
            Workouts
          </Link>
          <Link to="/social-challenges" className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${isActive('/social-challenges')}`}>
            Challenges
          </Link>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {token && user ? (
          <>
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold animate-pulse">
              <Flame size={14} className="fill-orange-500" />
              <span>{user.streakCount || 1} DAY STREAK</span>
            </div>

            {/* Profile Avatar & Signout */}
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-gray-400 font-medium">Logged in</p>
                <p className="text-sm font-semibold text-white">{user.username}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                title="Disconnect Neural Link (Logout)"
              >
                <LogOut size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold hover:opacity-90 shadow-md shadow-emerald-500/15 transition-all">
              Initialize Link
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
