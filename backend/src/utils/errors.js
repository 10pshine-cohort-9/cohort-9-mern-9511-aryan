/**
 * @typedef {Object} ValidationErrorDetail
 * @property {string} field
 * @property {string} message
 */

/**
 * Base Application Error class
 */
class AppError extends Error {
  /**
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code
   * @param {Array<string|ValidationErrorDetail>} [errors=[]] - Array of error details
   */
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  /**
   * @param {string} [message='Bad Request']
   * @param {Array<string|ValidationErrorDetail>} [errors=[]]
   */
  constructor(message = 'Bad Request', errors = []) {
    super(message, 400, errors);
  }
}

class UnauthorizedError extends AppError {
  /**
   * @param {string} [message='Unauthorized access']
   */
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  /**
   * @param {string} [message='Forbidden access']
   */
  constructor(message = 'Forbidden access') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  /**
   * @param {string} [message='Resource not found']
   */
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  /**
   * @param {string} [message='Resource already exists']
   */
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
};
