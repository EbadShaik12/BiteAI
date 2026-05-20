const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { chatWithCoach } = require('../controllers/coachController');

router.post('/chat', protect, chatWithCoach);

module.exports = router;
