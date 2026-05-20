import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchMealsSuccess, fetchWorkoutsSuccess, fetchAnalyticsSuccess } from '../redux/mealSlice';
import { updateGoalsSuccess } from '../redux/authSlice';
import { 
  Flame, PlusCircle, Scale, Award, Utensils, Zap, Trophy, Plus,
  ChevronRight, Smile, Heart, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { meals, workouts } = useSelector((state) => state.meals);

  const [weight, setWeight] = useState('');
  const [logWeightOpen, setLogWeightOpen] = useState(false);
  const [loadingWeight, setLoadingWeight] = useState(false);
  const [todayMeals, setTodayMeals] = useState([]);
  const [todayWorkouts, setTodayWorkouts] = useState([]);

  // Nutritional totals
  const [caloriesEaten, setCaloriesEaten] = useState(0);
  const [proteinEaten, setProteinEaten] = useState(0);
  const [carbsEaten, setCarbsEaten] = useState(0);
  const [fatsEaten, setFatsEaten] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Fetch meals for today
        const mealsRes = await axios.get(`/api/meals?date=${todayStr}`);
        if (mealsRes.data.success) {
          dispatch(fetchMealsSuccess(mealsRes.data.meals));
          setTodayMeals(mealsRes.data.meals);
        }

        // Fetch workouts
        const workoutsRes = await axios.get('/api/workouts');
        if (workoutsRes.data.success) {
          dispatch(fetchWorkoutsSuccess(workoutsRes.data.workouts));
          
          // Filter today's workouts
          const todayWorkoutsFiltered = workoutsRes.data.workouts.filter(w => {
            const wDate = new Date(w.loggedAt).toISOString().split('T')[0];
            return wDate === todayStr;
          });
          setTodayWorkouts(todayWorkoutsFiltered);
        }

        // Fetch analytics
        const analyticsRes = await axios.get('/api/meals/analytics');
        if (analyticsRes.data.success) {
          dispatch(fetchAnalyticsSuccess(analyticsRes.data));
        }

      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  // Aggregate stats
  useEffect(() => {
    let calSum = 0;
    let protSum = 0;
    let carbSum = 0;
    let fatSum = 0;
    todayMeals.forEach(m => {
      calSum += m.calories;
      protSum += m.protein;
      carbSum += m.carbs;
      fatSum += m.fats;
    });

    let activeBurn = 0;
    todayWorkouts.forEach(w => {
      activeBurn += w.caloriesBurned;
    });

    setCaloriesEaten(calSum);
    setProteinEaten(protSum);
    setCarbsEaten(carbSum);
    setFatsEaten(fatSum);
    setCaloriesBurned(activeBurn);
  }, [todayMeals, todayWorkouts]);

  const handleWeightLog = async (e) => {
    e.preventDefault();
    if (!weight) return;
    setLoadingWeight(true);
    try {
      const res = await axios.put('/api/auth/goals', { currentWeight: Number(weight) });
      if (res.data.success) {
        dispatch(updateGoalsSuccess(res.data.user));
        setWeight('');
        setLogWeightOpen(false);
      }
    } catch (error) {
      console.error('Weight updates failure:', error);
    } finally {
      setLoadingWeight(false);
    }
  };

  const calorieGoal = user?.dailyCalorieGoal || 2000;
  const netCalories = caloriesEaten - caloriesBurned;
  const calPercent = Math.min(Math.round((netCalories / calorieGoal) * 100), 100);
  const remainingCalories = Math.max(calorieGoal - netCalories, 0);

  // SVG Dashboard ring computations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'Happy': return '😊';
      case 'Energetic': return '⚡';
      case 'Stressed': return '😰';
      case 'Tired': return '😴';
      case 'Bored': return '😐';
      default: return '🥗';
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-screen pb-24 lg:pb-6">
      
      {/* Dynamic Streaks & Welcome Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl relative overflow-hidden">
        {/* Glow Backdrops */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
            Telemetry Core: <span className="text-emerald-400 text-neon-emerald">{user?.username}</span>
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed font-semibold">
            Health protocols stable. Bio-indicators logged. Keep it up!
          </p>
        </div>

        {/* Dynamic streaks card */}
        <div className="flex items-center gap-3 bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 border border-emerald-500/30 px-5 py-3 rounded-2xl glow-emerald">
          <Flame className="text-orange-500 animate-pulse" size={28} />
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Active Streak</p>
            <p className="text-xl font-black text-white">{user?.streakCount || 1} Days Logged</p>
          </div>
        </div>
      </div>

      {/* Grid: circular ring, macro summaries, daily records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Caloric balance progress ring */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl flex flex-col items-center justify-center relative min-h-[340px]">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 self-start pl-1">Daily Energy Balance</h3>
          
          <div className="relative flex items-center justify-center">
            {/* Circular Ring SVG */}
            <svg className="w-52 h-52 transform -rotate-90">
              <defs>
                <linearGradient id="emeraldCyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00F5A0" />
                  <stop offset="100%" stopColor="#00D2FF" />
                </linearGradient>
              </defs>
              <circle
                cx="104"
                cy="104"
                r={radius}
                strokeWidth="12"
                fill="transparent"
                className="circle-progress-bg"
              />
              <circle
                cx="104"
                cy="104"
                r={radius}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="circle-progress-bar"
              />
            </svg>
            
            {/* Center stats */}
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-3xl font-black text-white tracking-tight">{netCalories}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Net Calories</span>
              <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] text-emerald-400 font-bold tracking-wider">
                {calPercent}% OF GOAL
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 w-full mt-6 text-center border-t border-white/5 pt-5 gap-2">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Eaten</p>
              <p className="text-sm font-extrabold text-white mt-0.5">{caloriesEaten} kcal</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Burnt</p>
              <p className="text-sm font-extrabold text-cyan-400 mt-0.5">-{caloriesBurned} kcal</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Target</p>
              <p className="text-sm font-extrabold text-emerald-400 mt-0.5">{calorieGoal} kcal</p>
            </div>
          </div>
        </div>

        {/* Macros summary cards & quick commands */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Macronutrients Grid */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Macronutrient Allocation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Protein Tracker */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full filter blur-xl"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Protein (Builder)</p>
                    <p className="text-lg font-black text-white mt-1">{proteinEaten}g <span className="text-xs text-gray-500">/ {user?.proteinGoal || 130}g</span></p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold">
                    {Math.min(Math.round((proteinEaten / (user?.proteinGoal || 130)) * 100), 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-cyan-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((proteinEaten / (user?.proteinGoal || 130)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Carbs Tracker */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full filter blur-xl"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Carbohydrates</p>
                    <p className="text-lg font-black text-white mt-1">{carbsEaten}g <span className="text-xs text-gray-500">/ {user?.carbsGoal || 220}g</span></p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold">
                    {Math.min(Math.round((carbsEaten / (user?.carbsGoal || 220)) * 100), 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((carbsEaten / (user?.carbsGoal || 220)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Fats Tracker */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full filter blur-xl"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fats (Energy)</p>
                    <p className="text-lg font-black text-white mt-1">{fatsEaten}g <span className="text-xs text-gray-500">/ {user?.fatGoal || 65}g</span></p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                    {Math.min(Math.round((fatsEaten / (user?.fatGoal || 65)) * 100), 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min((fatsEaten / (user?.fatGoal || 65)) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

            </div>
          </div>

          {/* Bio Quick Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weight bio logger */}
            <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Scale className="text-cyan-400" size={18} />
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Biometric Weight</h3>
                </div>
                
                <button 
                  onClick={() => setLogWeightOpen(!logWeightOpen)}
                  className="p-1 px-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 text-xs font-semibold text-gray-300 hover:text-emerald-400 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus size={12} /> Log Weight
                </button>
              </div>

              {/* Show current weight */}
              {user?.weightHistory && user.weightHistory.length > 0 ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{user.weightHistory[user.weightHistory.length - 1].weight}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase">KG</span>
                  <span className="text-[10px] text-emerald-400 font-medium pl-2 flex items-center gap-0.5">
                    <TrendingUp size={10} /> stable metabolism
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-500 font-medium py-1">No weight recorded yet. Sync now.</p>
              )}

              {logWeightOpen && (
                <form onSubmit={handleWeightLog} className="mt-4 flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 74.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="flex-1 px-3 py-1.5 glass-input text-xs text-white"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loadingWeight}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-bold uppercase cursor-pointer hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {loadingWeight ? 'Saving...' : 'Sync'}
                  </button>
                </form>
              )}
            </div>

            {/* Quick stats achievements */}
            <div className="glass-panel p-6 rounded-3xl flex items-center gap-4 relative overflow-hidden">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Trophy size={24} className="stroke-[2.2] animate-bounce" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">AI Coach Diagnostic</p>
                <h4 className="text-sm font-extrabold text-white mt-0.5 leading-snug">
                  Optimal performance active. Water hydration matches standard base levels.
                </h4>
                <Link to="/coach" className="text-[10px] text-emerald-400 font-bold tracking-wider hover:underline flex items-center gap-0.5 mt-1.5 uppercase">
                  Aura Chat Protocol <ChevronRight size={10} />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Grid: food log history and workout offsets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Meals logged */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Utensils className="text-emerald-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Caloric Log Ledger</h3>
            </div>
            <Link 
              to="/meal-upload"
              className="p-1 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase text-emerald-400 hover:bg-emerald-500 hover:text-black cursor-pointer transition-all flex items-center gap-1"
            >
              <PlusCircle size={12} /> Scan Food
            </Link>
          </div>

          {todayMeals.length > 0 ? (
            <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
              {todayMeals.map((meal) => (
                <div key={meal._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-white/5 flex items-center justify-center text-lg shadow-inner">
                      {getMoodEmoji(meal.mood)}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{meal.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                        P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-white">{meal.calories} kcal</span>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{new Date(meal.loggedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">No fuel capsules logged today</p>
              <p className="text-xs text-gray-600 mt-1">Upload a meal image or scan a barcode to log instantly.</p>
            </div>
          )}
        </div>

        {/* Active Workouts log history */}
        <div className="glass-panel p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Zap className="text-cyan-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Energy Depletion</h3>
            </div>
            <Link 
              to="/workouts"
              className="p-1 px-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-bold uppercase text-cyan-400 hover:bg-cyan-500 hover:text-black cursor-pointer transition-all flex items-center gap-1"
            >
              <PlusCircle size={12} /> Log Workout
            </Link>
          </div>

          {todayWorkouts.length > 0 ? (
            <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
              {todayWorkouts.map((w) => (
                <div key={w._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Zap size={20} className="stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{w.name}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        Duration: {w.duration} min | Protocol: {w.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-cyan-400">-{w.caloriesBurned} kcal</span>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">{new Date(w.loggedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">No active sessions logs today</p>
              <p className="text-xs text-gray-600 mt-1">Select from workouts and log caloric depletion.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
