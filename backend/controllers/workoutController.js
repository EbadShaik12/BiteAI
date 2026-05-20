const Workout = require('../models/Workout');

// Database of workouts to simulate ExerciseDB
const WORKOUT_CATALOGUE = [
  { name: 'Kettlebell Swings', type: 'HIIT', caloriesPerMinute: 12, target: 'Glutes & Shoulders', intensity: 'High' },
  { name: 'Treadmill Incline Run', type: 'Cardio', caloriesPerMinute: 10, target: 'Cardiovascular', intensity: 'High' },
  { name: 'Barbell Squats', type: 'Strength', caloriesPerMinute: 8, target: 'Quads & Hamstrings', intensity: 'Medium' },
  { name: 'Dumbbell Bicep Curls', type: 'Strength', caloriesPerMinute: 5, target: 'Biceps', intensity: 'Low' },
  { name: 'Bodyweight Push-Ups', type: 'Strength', caloriesPerMinute: 6, target: 'Chest & Triceps', intensity: 'Medium' },
  { name: 'Burpees Blast', type: 'HIIT', caloriesPerMinute: 14, target: 'Full Body', intensity: 'Maximum' },
  { name: 'Vinyasa Flow Yoga', type: 'Flexibility', caloriesPerMinute: 4, target: 'Core & Hamstrings', intensity: 'Low' },
  { name: 'Stationary Cycling', type: 'Cardio', caloriesPerMinute: 9, target: 'Legs & Endurance', intensity: 'Medium' }
];

// @desc    Log a new workout
// @route   POST /api/workouts
// @access  Private
const logWorkout = async (req, res) => {
  try {
    const { name, duration, caloriesBurned, type, loggedAt } = req.body;

    if (!name || !duration || !caloriesBurned) {
      return res.status(400).json({ success: false, message: 'Please provide name, duration, and calories burned' });
    }

    const workout = await Workout.create({
      userId: req.user._id,
      name,
      duration: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      type: type || 'Cardio',
      loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
    });

    res.status(201).json({ success: true, workout });
  } catch (error) {
    console.error('Log workout error:', error);
    res.status(500).json({ success: false, message: 'Server error logging workout' });
  }
};

// @desc    Get user's logged workouts
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ loggedAt: -1 });
    res.json({ success: true, count: workouts.length, workouts });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving workouts' });
  }
};

// @desc    Search/recommend exercises (simulates ExerciseDB API)
// @route   GET /api/workouts/search
// @access  Private
const searchWorkouts = async (req, res) => {
  try {
    const { query, type } = req.query;
    
    let results = [...WORKOUT_CATALOGUE];

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(w => w.name.toLowerCase().includes(q) || w.target.toLowerCase().includes(q));
    }

    if (type) {
      results = results.filter(w => w.type.toLowerCase() === type.toLowerCase());
    }

    res.json({
      success: true,
      source: 'biteai-exercisedb-mirror',
      results
    });
  } catch (error) {
    console.error('Search workouts error:', error);
    res.status(500).json({ success: false, message: 'Server exercise catalogue searching error' });
  }
};

module.exports = {
  logWorkout,
  getWorkouts,
  searchWorkouts
};
