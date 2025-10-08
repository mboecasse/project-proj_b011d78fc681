// File: src/middleware/rateLimiter.js
// Generated: 2025-10-08 11:51:26 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_b7ssdsc0vvct


const config = require('../config/env');


const logger = require('../utils/logger');


const rateLimit = require('express-rate-limit');

/**
 * Rate limiter middleware to prevent abuse
 * Limits requests per IP address within a time window
 */


const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: config.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
    max: config.RATE_LIMIT_MAX_REQUESTS || 100,
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent')
      });

      res.status(429).json({
        success: false,
        error: 'Too many requests from this IP, please try again later'
      });
    },
    skip: (req) => {
      if (config.NODE_ENV === 'test') {
        return true;
      }
      return false;
    },
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress;
    }
  };

  const limiterOptions = { ...defaultOptions, ...options };

  logger.info('Rate limiter configured', {
    windowMs: limiterOptions.windowMs,
    maxRequests: limiterOptions.max,
    environment: config.NODE_ENV
  });

  return rateLimit(limiterOptions);
};


const apiLimiter = createRateLimiter({
  windowMs: config.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: config.RATE_LIMIT_MAX_REQUESTS || 100,
  message: {
    success: false,
    error: 'Too many API requests, please try again later'
  }
});


const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later'
  },
  skipSuccessfulRequests: true
});


const strictLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: 'Rate limit exceeded, please slow down'
  }
});

module.exports = {
  createRateLimiter,
  apiLimiter,
  authLimiter,
  strictLimiter
};
