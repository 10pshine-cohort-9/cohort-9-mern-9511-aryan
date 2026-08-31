const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { ConflictError, BadRequestError, UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * @typedef {Object} RegisterUserDTO
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} LoginUserDTO
 * @property {string} email
 * @property {string} password
 */

/**
 * Generates JWT token for user authentication
 * @param {string} id - User ID
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }
  /** @type {import('jsonwebtoken').SignOptions} */
  const options = {
    expiresIn: /** @type {any} */ (process.env.JWT_EXPIRES_IN || '7d')
  };
  return jwt.sign({ id }, secret, options);
};

/**
 * Registers a new user
 * @param {RegisterUserDTO} userData
 */
const registerUser = async (userData) => {
  if (!userData || typeof userData !== 'object') {
    throw new BadRequestError('Invalid user registration payload.');
  }

  const { name, email, password } = userData;

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    throw new BadRequestError('Please provide all required fields: name, email, and password as strings.');
  }

  const cleanEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    throw new ConflictError('A user with this email already exists.');
  }

  const user = await User.create({
    name: name.trim(),
    email: cleanEmail,
    password
  });

  const token = generateToken(user._id.toString());
  logger.info('User registered successfully');

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    },
    token
  };
};

/**
 * Authenticates an existing user
 * @param {LoginUserDTO} credentials
 */
const loginUser = async (credentials) => {
  if (!credentials || typeof credentials !== 'object') {
    throw new BadRequestError('Invalid login credentials payload.');
  }

  const { email, password } = credentials;

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !email.trim() ||
    !password
  ) {
    throw new BadRequestError('Please provide all required fields: email and password as strings.');
  }

  const cleanEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: cleanEmail }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid credentials.');
  }

  const isMatch = await /** @type {any} */ (user).comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials.');
  }

  const token = generateToken(user._id.toString());
  logger.info('User logged in successfully');

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    },
    token
  };
};

/**
 * Retrieves profile of logged-in user
 * @param {string} userId
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthorizedError('User not found.');
  }
  return user;
};

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile
};
