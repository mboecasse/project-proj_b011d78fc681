// File: src/middleware/requestLogger.js
// Generated: 2025-10-08 11:51:29 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_jp92x5h5jsd6


const logger = require('../utils/logger');


const morgan = require('morgan');


const stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};


const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'test';
};


const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

module.exports = requestLogger;
