import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { fetchAnalyticsSuccess } from '../redux/mealSlice';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  BarChart3, Calendar, PieChart as PieIcon, Activity, Sparkles,
  TrendingDown, Brain, Smile
} from 'lucide-react';

const Analytics = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector((state) => state.meals);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/meals/analytics');
        if (res.data.success) {
          dispatch(fetchAnalyticsSuccess(res.data));
        }
      } catch (err) {
        console.error('Error fetching analytics reports:', err);
      }
    };
    fetchAnalytics();
  }, [dispatch]);

  const calorieGoal = user?.dailyCalorieGoal || 2000;

  // Process weekly line chart data
  const lineChartData = analytics?.weeklyBreakdown?.map(item => ({
    ...item,
    target: calorieGoal
  })) || [];

  // Process macro pie chart data
  const proteinVal = analytics?.summary?.totalProtein || 0;
  const carbsVal = analytics?.summary?.totalCarbs || 0;
  const fatsVal = analytics?.summary?.totalFats || 0;
  const totalMacros = proteinVal + carbsVal + fatsVal;

  const pieChartData = totalMacros > 0 ? [
    { name: 'Protein', value: proteinVal, color: '#06B6D4' },
    { name: 'Carbohydrates', value: carbsVal, color: '#6366F1' },
    { name: 'Fats', value: fatsVal, color: '#F59E0B' },
  ] : [
    { name: 'Protein (Demo)', value: 120, color: '#06B6D4' },
    { name: 'Carbohydrates (Demo)', value: 200, color: '#6366F1' },
    { name: 'Fats (Demo)', value: 65, color: '#F59E0B' },
  ];

  // Process mood-eating bar chart data
  const barChartData = analytics?.moodAnalytics || [];

  // Custom tooltips styling for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3.5 rounded-xl border border-white/10 text-xs shadow-2xl">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((entry, idx) => (
            <p key={idx} style={{ color: entry.color }} className="font-semibold py-0.5">
              {entry.name}: {entry.value} {entry.name.includes('Calorie') || entry.name.includes('target') ? 'kcal' : 'g'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-screen pb-24 lg:pb-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
          Bio-Analytics Console: <span className="text-emerald-400 text-neon-emerald">Habit Mapping</span>
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed font-semibold">
          Compile weekly trends, analyze energy balances, and identify emotional dietary triggers.
        </p>
      </div>

      {/* Grid: calorie line chart and macro distribution pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calorie trend chart (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl min-h-[360px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-emerald-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Weekly Calorie Velocity</h3>
            </div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              7-Day Log
            </div>
          </div>

          <div className="flex-1 min-h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="day" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  name="Calories Logged" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 0, fill: '#10B981' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  name="Target Goal" 
                  stroke="rgba(255,255,255,0.15)" 
                  strokeDasharray="5 5" 
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Macro average distribution pie (1 col) */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl min-h-[360px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="text-cyan-400" size={18} />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Macro Ratio Allocation</h3>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(7, 10, 19, 0.8)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Legends */}
          <div className="grid grid-cols-3 gap-2 text-center border-t border-white/5 pt-4">
            {pieChartData.map((item, idx) => (
              <div key={idx}>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </p>
                <p className="text-sm font-extrabold text-white mt-0.5">{item.value}g</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Mood eating bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Mood eating analysis bar graph */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl min-h-[340px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-indigo-400" size={18} />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mood-Based Calorie Intakes</h3>
          </div>

          <div className="flex-1 min-h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="mood" stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="averageCalories" 
                  name="Calorie Average" 
                  radius={[8, 8, 0, 0]}
                >
                  {barChartData.map((entry, index) => {
                    const colors = {
                      Happy: '#10B981',
                      Energetic: '#06B6D4',
                      Stressed: '#EF4444',
                      Tired: '#8B5CF6',
                      Bored: '#6B7280',
                      Neutral: '#EC4899',
                    };
                    const color = colors[entry.mood] || '#10B981';
                    return <Cell key={`cell-${index}`} fill={color} opacity={0.8} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cognitive Health Report summary */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-pink-400" size={18} />
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Cognitive Summary</h3>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <Smile className="text-emerald-400 shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Optimal Fuel Mood</h4>
                <p className="text-[10px] text-gray-400 leading-normal font-semibold mt-1">
                  You track calories most consistently when logged as **Energetic** or **Happy**. Nutrient absorption is peaking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <TrendingDown className="text-rose-400 shrink-0 mt-0.5" size={16} />
              <div>
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Stress-Eating Spike</h4>
                <p className="text-[10px] text-gray-400 leading-normal font-semibold mt-1">
                  When logged as **Stressed**, calorie size averages are **20% higher** than standard levels. Swap high-glycemic snacks with warm teas.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 mt-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <span className="text-[9px] text-indigo-300 font-extrabold uppercase tracking-widest">Neuro-Diet Profile: Active</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
