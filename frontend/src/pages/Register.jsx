import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authStart, authSuccess, authFailure, clearError } from '../redux/authSlice';
import axios from 'axios';
import { Activity, Mail, Lock, User, ActivitySquare, ShieldAlert } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(130);
  const [carbsGoal, setCarbsGoal] = useState(220);
  const [fatGoal, setFatGoal] = useState(65);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
    return () => {
      dispatch(clearError());
    };
  }, [token, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !username) return;

    try {
      dispatch(authStart());
      const res = await axios.post('/api/auth/register', {
        username,
        email,
        password,
        dailyCalorieGoal,
        proteinGoal,
        carbsGoal,
        fatGoal
      });

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
      const errMsg = err.response?.data?.message || 'Biometric onboarding registry failed.';
      dispatch(authFailure(errMsg));
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20 mb-4">
            <ActivitySquare size={24} className="stroke-[2.5]" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">Initialize Biometrics</h2>
          <p className="text-sm text-gray-400">Establish your digital caloric signature</p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-4 mb-6 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm">
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Col: Credentials */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 tracking-wider uppercase mb-1">1. Sync Details</h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Handle Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3 text-gray-500" size={18} />
                  <input
                    type="text"
                    placeholder="CyberTrack99"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 glass-input text-sm text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Email Node</label>
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
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Encrypt Password</label>
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
            </div>

            {/* Right Col: Goal Targets */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-cyan-400 tracking-wider uppercase mb-1">2. Metabolic Tuning</h3>
              
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 pl-1">
                  <span>Daily Calories</span>
                  <span className="text-emerald-400">{dailyCalorieGoal} kcal</span>
                </div>
                <input
                  type="range"
                  min="1200"
                  max="4000"
                  step="50"
                  value={dailyCalorieGoal}
                  onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-ew-resize bg-white/10 rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 pl-1">
                  <span>Protein Target</span>
                  <span className="text-cyan-400">{proteinGoal}g</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="250"
                  step="5"
                  value={proteinGoal}
                  onChange={(e) => setProteinGoal(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-ew-resize bg-white/10 rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 pl-1">
                  <span>Carbs Target</span>
                  <span className="text-indigo-400">{carbsGoal}g</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="5"
                  value={carbsGoal}
                  onChange={(e) => setCarbsGoal(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-ew-resize bg-white/10 rounded-lg h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 pl-1">
                  <span>Fat Target</span>
                  <span className="text-amber-400">{fatGoal}g</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="5"
                  value={fatGoal}
                  onChange={(e) => setFatGoal(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-ew-resize bg-white/10 rounded-lg h-2"
                />
              </div>
            </div>
          </div>

          {/* Core Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold tracking-wide uppercase hover:opacity-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all text-sm"
          >
            {loading ? 'Initializing Core...' : 'Inject Registry Protocol'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already synced?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold underline transition-colors">
            Connect Neural Link
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
