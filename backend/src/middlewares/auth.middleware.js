const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * @typedef {Object} JwtPayload
 * @property {string} id
 * @property {number} [iat]
 * @property {number} [exp]
 */

/**
 * Express middleware to protect routes with JWT authentication
 * @param {import('express').Request & { user?: any }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
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

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error('JWT_SECRET environment variable is missing.');
    throw new UnauthorizedError('Server configuration error. JWT_SECRET is missing.');
  }

  try {
    /** @type {JwtPayload} */
    const decoded = /** @type {JwtPayload} */ (jwt.verify(token, secret));

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
