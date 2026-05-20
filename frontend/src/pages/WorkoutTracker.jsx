import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkoutsSuccess, addWorkoutSuccess } from '../redux/mealSlice';
import { 
  Dumbbell, Search, Zap, CheckCircle, Flame, Plus,
  Sparkles, History, Timer
} from 'lucide-react';

const WorkoutTracker = () => {
  const dispatch = useDispatch();
  const { workouts, loading } = useSelector((state) => state.meals);

  const [searchQuery, setSearchQuery] = useState('');
  const [exercisesList, setExercisesList] = useState([]);
  const [searching, setSearching] = useState(false);

  // Active logging states
  const [exerciseName, setExerciseName] = useState('');
  const [workoutType, setWorkoutType] = useState('Cardio');
  const [duration, setDuration] = useState(30);
  const [caloriesBurned, setCaloriesBurned] = useState(240);
  const [logging, setLogging] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Search catalog on query
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  // Recalculate estimated active calories burned based on duration and MET rates
  useEffect(() => {
    let metCoeff = 8; // default cardio
    if (workoutType === 'HIIT') metCoeff = 12;
    if (workoutType === 'Strength') metCoeff = 6;
    if (workoutType === 'Flexibility') metCoeff = 4;
    
    setCaloriesBurned(duration * metCoeff);
  }, [duration, workoutType]);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const res = await axios.get(`/api/workouts/search?query=${searchQuery}`);
      if (res.data.success) {
        setExercisesList(res.data.results);
      }
    } catch (error) {
      console.error('Error fetching exercise directory:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    if (!exerciseName || !duration || !caloriesBurned) return;

    setLogging(true);
    try {
      const res = await axios.post('/api/workouts', {
        name: exerciseName,
        type: workoutType,
        duration: Number(duration),
        caloriesBurned: Number(caloriesBurned),
      });

      if (res.data.success) {
        dispatch(addWorkoutSuccess(res.data.workout));
        setSuccessMsg(true);
        setExerciseName('');
        setDuration(30);
        setTimeout(() => {
          setSuccessMsg(false);
        }, 1500);
      }
    } catch (error) {
      console.error('Error logging workout:', error);
    } finally {
      setLogging(false);
    }
  };

  const handleSelectExercise = (ex) => {
    setExerciseName(ex.name);
    setWorkoutType(ex.type);
    
    let metCoeff = ex.caloriesPerMinute || 8;
    setCaloriesBurned(duration * metCoeff);
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto min-h-screen pb-24 lg:pb-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
          Workout Tracker: <span className="text-cyan-400 text-neon-cyan">Active Calorie Burn</span>
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed font-semibold">
          Search exercise protocols, estimate energy output, and offset daily calorie intakes.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold text-center flex items-center justify-center gap-2">
          <CheckCircle size={18} /> Workout successfully synchronized with calorie deficit engine!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Exercise lookup directory (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl min-h-[460px] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Search className="text-cyan-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Exercise Directory Lookup</h3>
            </div>

            {/* Input search */}
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-3 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search e.g. squats, kettlebell, pushups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass-input text-xs text-white"
              />
            </div>

            {/* List results */}
            <div className="flex-1 overflow-y-auto max-h-[300px] space-y-2 pr-1">
              {searching ? (
                <p className="text-xs text-gray-500 font-semibold py-4 text-center">Querying ExerciseDB Database...</p>
              ) : exercisesList.length > 0 ? (
                exercisesList.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectExercise(ex)}
                    className="w-full text-left p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-xs font-extrabold text-white group-hover:text-cyan-400 transition-colors">{ex.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">Target: {ex.target} | Intensity: {ex.intensity}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-extrabold border border-cyan-500/20">
                      {ex.type}
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-xs text-gray-600 font-semibold py-8 text-center">No matching exercises in directories.</p>
              )}
            </div>
          </div>
        </div>

        {/* Center Col: Log Workout panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between h-full">
            <div className="flex items-center gap-2 mb-6">
              <Timer className="text-cyan-400" size={18} />
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Calorie Depletion Logger</h3>
            </div>

            <form onSubmit={handleLogWorkout} className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Exercise Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Barbell Squats"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    className="w-full px-3.5 py-2.5 glass-input text-xs text-white"
                    required
                  />
                </div>

                {/* Grid Type and duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Workout Type */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-1">Protocol Type</label>
                    <select
                      value={workoutType}
                      onChange={(e) => setWorkoutType(e.target.value)}
                      className="w-full px-3 py-2.5 glass-input text-xs text-white"
                    >
                      <option value="Cardio">Cardio</option>
                      <option value="Strength">Strength</option>
                      <option value="HIIT">HIIT</option>
                      <option value="Flexibility">Flexibility</option>
                    </select>
                  </div>

                  {/* Duration Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 pl-1">
                      <span>Duration</span>
                      <span className="text-cyan-400">{duration} minutes</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="180"
                      step="5"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-ew-resize bg-white/10 rounded-lg h-1.5 mt-2"
                    />
                  </div>

                </div>

                {/* Energy Depletion Summary */}
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-500/5 to-emerald-500/5 border border-cyan-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="text-orange-500" size={18} />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Active Calorie Burn</p>
                      <p className="text-xs text-gray-500 mt-0.5">Dynamic Met Coefficient matches targets.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white">{caloriesBurned}</span>
                    <span className="text-xs text-cyan-400 font-bold pl-1">KCAL</span>
                  </div>
                </div>
              </div>

              {/* Submit Log */}
              <button
                type="submit"
                disabled={logging || !exerciseName}
                className="w-full py-3.5 mt-8 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold tracking-wide uppercase hover:opacity-95 disabled:opacity-40 cursor-pointer shadow-lg shadow-emerald-500/15 active:scale-[0.99] transition-all text-xs"
              >
                {logging ? 'Synchronizing Biometric Ledger...' : 'Commit Active Depletion Entry'}
              </button>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WorkoutTracker;
