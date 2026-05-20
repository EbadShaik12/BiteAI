const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_cyber_security_jwt_token_key_99');

      // Get user from database (excluding password)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found or authorization failed' });
      }

      next();
    } catch (error) {
      console.error('Auth verification error:', error);
      return res.status(401).json({ success: false, message: 'Unauthorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized, no auth token found' });
  }
};

module.exports = { protect };
