const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { logWorkout, getWorkouts, searchWorkouts } = require('../controllers/workoutController');

router.post('/', protect, logWorkout);
router.get('/', protect, getWorkouts);
router.get('/search', protect, searchWorkouts);

module.exports = router;
