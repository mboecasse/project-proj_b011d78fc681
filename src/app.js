// File: src/app.js
// Generated: 2025-10-08 11:51:48 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_jf2v2qzboxg1


const config = require('./config/env');


const cors = require('cors');


const errorHandler = require('./middleware/errorHandler');


const express = require('express');


const helmet = require('helmet');


const logger = require('./utils/logger');


const rateLimiter = require('./middleware/rateLimiter');


const requestLogger = require('./middleware/requestLogger');


const routes = require('./routes');


const securityMiddleware = require('./middleware/security');


const app = express();

// Trust proxy - required for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Security middleware - helmet, cors, xss protection
app.use(securityMiddleware);

// Request logging - morgan logger for all incoming requests
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - prevent abuse
app.use(rateLimiter);

// Health check endpoint - no auth required
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV,
      uptime: process.uptime()
    },
    message: 'Service is running'
  });
});

// API routes
app.use('/api', routes);

// 404 handler - must be after all routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler - must be last middleware
app.use(errorHandler);

// Graceful shutdown handler
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
    promise
  });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

module.exports = app;
