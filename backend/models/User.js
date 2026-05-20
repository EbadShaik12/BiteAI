const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  dailyCalorieGoal: {
    type: Number,
    default: 2000,
  },
  proteinGoal: {
    type: Number,
    default: 130, // grams
  },
  carbsGoal: {
    type: Number,
    default: 220, // grams
  },
  fatGoal: {
    type: Number,
    default: 65, // grams
  },
  streakCount: {
    type: Number,
    default: 0,
  },
  lastLoginDate: {
    type: Date,
  },
  weightHistory: [
    {
      date: { type: Date, default: Date.now },
      weight: { type: Number, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
