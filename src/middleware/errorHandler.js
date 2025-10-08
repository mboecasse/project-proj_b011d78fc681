// File: src/middleware/errorHandler.js
// Generated: 2025-10-08 11:51:37 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_svmocoymk07s


const logger = require('../utils/logger');

const { formatErrorResponse } = require('../utils/responseFormatter');

/**
 * Global error handling middleware
 * Catches all errors thrown in the application and formats consistent error responses
 *
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */


const errorHandler = (err, req, res, next) => {
  // Log error with context
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString()
  });

  // Default error values
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal server error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';

    // Extract validation errors if available
    if (err.errors) {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      message = validationErrors.join(', ');
    }
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry - resource already exists';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized access';
  }

  if (err.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Access forbidden';
  }

  if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'An unexpected error occurred';
  }

  // Send formatted error response
  res.status(statusCode).json(formatErrorResponse(message));
};

/**
 * 404 Not Found handler
 * Catches requests to undefined routes
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */


const notFoundHandler = (req, res) => {
  logger.warn('Route not found', {
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  res.status(404).json(formatErrorResponse('Route not found'));
};

module.exports = {
  errorHandler,
  notFoundHandler
};
