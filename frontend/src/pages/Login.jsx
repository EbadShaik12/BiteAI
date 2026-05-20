import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure, clearError } from '../redux/authSlice';
import axios from 'axios';
import { Activity, Mail, Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    // If logged in, send directly to dashboard
    if (token) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      dispatch(authStart());
      const res = await axios.post('/api/auth/login', { email, password });
      
      if (res.data.success) {
        dispatch(authSuccess({
          user: {
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
            dailyCalorieGoal: res.data.dailyCalorieGoal,
            proteinGoal: res.data.proteinGoal,
            carbsGoal: res.data.carbsGoal,
            fatGoal: res.data.fatGoal,
            streakCount: res.data.streakCount,
          },
          token: res.data.token,
        }));
        navigate('/dashboard');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Biometric authentication failed. Check credentials.';
      dispatch(authFailure(errMsg));
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20 mb-4">
            <Activity size={24} className="stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Neural Connection</h2>
          <p className="text-sm text-gray-400">Sync with BiteAI Health core network</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-4 mb-6 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Email Interface</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3 text-gray-500" size={18} />
              <input
                type="email"
                placeholder="pilot@biteai.corp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 glass-input text-sm text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Security Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 text-gray-500" size={18} />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 glass-input text-sm text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold tracking-wide uppercase hover:opacity-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all text-sm"
          >
            {loading ? 'Initiating Neural Link...' : 'Establish Neural Link'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          New to the protocol?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold underline transition-colors">
            Register Biometrics
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
