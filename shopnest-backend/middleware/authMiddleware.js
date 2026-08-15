const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * protect – verifies JWT and attaches user to req.user
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorised – no token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    req.user = user;
    next();
  } catch (err) {
    logger.warn(`🔐 Auth failed: ${err.message}`);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * restrictTo – role-based access guard
 * Usage: restrictTo('seller'), restrictTo('buyer', 'seller')
 */
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied – only ${roles.join('/')} allowed` });
  }
  next();
};

module.exports = { protect, restrictTo };
