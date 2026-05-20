const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: true, // in minutes
  },
  caloriesBurned: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['Cardio', 'Strength', 'Flexibility', 'HIIT', 'Other'],
    default: 'Cardio',
  },
  loggedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Workout', workoutSchema);
