const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { logMeal, getMeals, getMealAnalytics, scanBarcode, detectMealAI } = require('../controllers/mealController');

// Multer memory storage for clean temporary buffer handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', protect, logMeal);
router.get('/', protect, getMeals);
router.get('/analytics', protect, getMealAnalytics);
router.post('/barcode', protect, scanBarcode);
router.post('/detect', protect, upload.single('image'), detectMealAI);

module.exports = router;
