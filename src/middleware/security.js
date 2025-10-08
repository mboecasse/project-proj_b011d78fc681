// File: src/middleware/security.js
// Generated: 2025-10-08 11:51:34 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_auu02dbpf251


const cors = require('cors');


const env = require('../config/env');


const helmet = require('helmet');


const hpp = require('hpp');


const logger = require('../utils/logger');


const mongoSanitize = require('express-mongo-sanitize');


const rateLimit = require('express-rate-limit');


const xss = require('xss-clean');

/**
 * Configure Helmet security headers
 * @returns {Function} Helmet middleware
 */


const configureHelmet = () => {
  return helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    frameguard: {
      action: 'deny'
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin'
    }
  });
};

/**
 * Configure CORS options
 * @returns {Object} CORS configuration
 */


const configureCors = () => {
  const whitelist = env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',') : ['http://localhost:3000'];

  return cors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1 || env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        logger.warn('CORS blocked request', { origin });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400
  });
};

/**
 * Configure rate limiting
 * @returns {Function} Rate limiter middleware
 */


const configureRateLimit = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: env.RATE_LIMIT_MAX || 100,
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
        method: req.method
      });
      res.status(429).json({
        success: false,
        error: 'Too many requests from this IP, please try again later'
      });
    },
    skip: (req) => {
      return env.NODE_ENV === 'development' && req.ip === '127.0.0.1';
    }
  });
};

/**
 * Configure XSS protection
 * @returns {Function} XSS clean middleware
 */


const configureXss = () => {
  return xss();
};

/**
 * Configure NoSQL injection protection
 * @returns {Function} Mongo sanitize middleware
 */


const configureMongoSanitize = () => {
  return mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      logger.warn('Potential NoSQL injection attempt detected', {
        ip: req.ip,
        path: req.path,
        key
      });
    }
  });
};

/**
 * Configure HTTP Parameter Pollution protection
 * @returns {Function} HPP middleware
 */


const configureHpp = () => {
  return hpp({
    whitelist: ['sort', 'fields', 'page', 'limit']
  });
};

/**
 * Security middleware to hide powered-by header
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */


const hidePoweredBy = (req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
};

/**
 * Security middleware to add custom security headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */


const addCustomHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
};

/**
 * Apply all security middleware to Express app
 * @param {Object} app - Express application instance
 */


const applySecurity = (app) => {
  logger.info('Applying security middleware');

  app.use(configureHelmet());
  app.use(configureCors());
  app.use(configureRateLimit());
  app.use(configureXss());
  app.use(configureMongoSanitize());
  app.use(configureHpp());
  app.use(hidePoweredBy);
  app.use(addCustomHeaders);

  app.disable('x-powered-by');

  logger.info('Security middleware applied successfully');
};

module.exports = {
  applySecurity,
  configureHelmet,
  configureCors,
  configureRateLimit,
  configureXss,
  configureMongoSanitize,
  configureHpp,
  hidePoweredBy,
  addCustomHeaders
};
