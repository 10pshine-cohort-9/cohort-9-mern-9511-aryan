const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.warn(`Unauthorized access attempt to ${req.originalUrl}`);
    throw new UnauthorizedError('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_jwt_key_notes_app_2026'
    );

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      logger.warn(`User with ID ${decoded.id} no longer exists`);
      throw new UnauthorizedError('User belonging to this token no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    logger.warn(`Invalid or expired token provided: ${error.message}`);
    throw new UnauthorizedError('Invalid or expired token. Please log in again.');
  }
};

module.exports = { protect };
