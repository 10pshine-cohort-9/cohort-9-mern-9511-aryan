const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { ConflictError, BadRequestError, UnauthorizedError } = require('../utils/errors');
const logger = require('../utils/logger');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_track_box_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const registerUser = async (userData) => {
  const { name, email, password } = userData;

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all required fields: name, email, and password.');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ConflictError('A user with this email already exists.');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password
  });

  const token = generateToken(user._id);
  logger.info(`User registered successfully: ${user.email} (${user._id})`);

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

const loginUser = async (credentials) => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password.');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid credentials.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials.');
  }

  const token = generateToken(user._id);
  logger.info(`User logged in successfully: ${user.email} (${user._id})`);

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
