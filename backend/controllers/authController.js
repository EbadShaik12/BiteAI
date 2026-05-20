const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_cyber_security_jwt_token_key_99', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, dailyCalorieGoal, proteinGoal, carbsGoal, fatGoal } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      dailyCalorieGoal: dailyCalorieGoal || 2000,
      proteinGoal: proteinGoal || 130,
      carbsGoal: carbsGoal || 220,
      fatGoal: fatGoal || 65,
      streakCount: 1,
      lastLoginDate: new Date(),
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        dailyCalorieGoal: user.dailyCalorieGoal,
        proteinGoal: user.proteinGoal,
        carbsGoal: user.carbsGoal,
        fatGoal: user.fatGoal,
        streakCount: user.streakCount,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server registration error' });
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update login streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (user.lastLoginDate) {
      const lastLogin = new Date(user.lastLoginDate);
      lastLogin.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today - lastLogin);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streakCount += 1;
      } else if (diffDays > 1) {
        user.streakCount = 1;
      }
      // If diffDays === 0, it is the same day. Do not change the streak count.
    } else {
      user.streakCount = 1;
    }

    user.lastLoginDate = new Date();
    await user.save();

    res.json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      dailyCalorieGoal: user.dailyCalorieGoal,
      proteinGoal: user.proteinGoal,
      carbsGoal: user.carbsGoal,
      fatGoal: user.fatGoal,
      streakCount: user.streakCount,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server login error' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Server profile fetching error' });
  }
};

// @desc    Update user goals and weight
// @route   PUT /api/auth/goals
// @access  Private
const updateUserGoals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { dailyCalorieGoal, proteinGoal, carbsGoal, fatGoal, currentWeight } = req.body;

    if (dailyCalorieGoal !== undefined) user.dailyCalorieGoal = dailyCalorieGoal;
    if (proteinGoal !== undefined) user.proteinGoal = proteinGoal;
    if (carbsGoal !== undefined) user.carbsGoal = carbsGoal;
    if (fatGoal !== undefined) user.fatGoal = fatGoal;

    if (currentWeight !== undefined) {
      user.weightHistory.push({
        date: new Date(),
        weight: currentWeight
      });
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        dailyCalorieGoal: updatedUser.dailyCalorieGoal,
        proteinGoal: updatedUser.proteinGoal,
        carbsGoal: updatedUser.carbsGoal,
        fatGoal: updatedUser.fatGoal,
        streakCount: updatedUser.streakCount,
        weightHistory: updatedUser.weightHistory
      }
    });
  } catch (error) {
    console.error('Goal update error:', error);
    res.status(500).json({ success: false, message: 'Server updating goals error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserGoals,
};
