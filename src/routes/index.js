// File: src/routes/index.js
// Generated: 2025-10-08 11:51:15 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_a6mhdjz1pdwq


const express = require('express');


const logger = require('../utils/logger');


const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  logger.info('Health check endpoint accessed');
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    },
    message: 'Service is running'
  });
});

// Root route
router.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.status(200).json({
    success: true,
    data: {
      message: 'Welcome to the API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        root: '/'
      }
    },
    message: 'API is operational'
  });
});

// 404 handler for undefined routes
router.use('*', (req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  });
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

module.exports = router;
