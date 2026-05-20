require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = async () => {
  // Try connecting or fallback to mock
  try {
    const connect = require('./config/db');
    await connect();
  } catch (err) {
    console.log('⚠️ Database connection error. Starting in dev-fallback mode.');
  }
};

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check / AI Interface Hello
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'BiteAI Cyber-Core',
    message: 'Biometric scanning active. Core health vectors initialized.',
    timestamp: new Date()
  });
});

// Import and register routes
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const coachRoutes = require('./routes/coachRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/coach', coachRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('System Exception:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Fatal system core override'
  });
});

// Boot Database & Listen
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`📡 BiteAI Core Online & Listening on: http://localhost:${PORT}`);
  });
});
