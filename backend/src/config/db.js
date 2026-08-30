const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connects to MongoDB database using Mongoose
 * @returns {Promise<typeof mongoose | void>} Mongoose connection instance
 */
const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notes_db';
    logger.info(`Connecting to database...`);
    const conn = await mongoose.connect(connStr);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
