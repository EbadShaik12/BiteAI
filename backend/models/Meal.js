const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
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
  calories: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  fats: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  barcode: {
    type: String,
    default: '',
  },
  mood: {
    type: String,
    enum: ['Happy', 'Stressed', 'Tired', 'Bored', 'Energetic', 'Neutral'],
    default: 'Neutral',
  },
  loggedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Meal', mealSchema);
