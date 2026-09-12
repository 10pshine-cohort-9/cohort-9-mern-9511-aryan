require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const httpLogger = require('./middlewares/httpLogger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const apiRoutes = require('./routes');
const { NotFoundError } = require('./utils/errors');

/** @type {import('express').Application} */
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logger
if (process.env.NODE_ENV !== 'test') {
  app.use(httpLogger);
}

// API Routes
app.use('/api', apiRoutes);

// Handle 404 Undefined Routes
app.use('*', (req, res, next) => {
  throw new NotFoundError(`Route ${req.originalUrl} not found`);
});

// Global Exception Handler Middleware
app.use(errorHandler);

module.exports = app;
