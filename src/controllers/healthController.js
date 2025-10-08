// File: src/controllers/healthController.js
// Generated: 2025-10-08 11:51:49 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_3yfhzfp3zex1


const logger = require('../utils/logger');


const os = require('os');

const { formatSuccess, formatError } = require('../utils/responseFormatter');

/**
 * Basic health check endpoint
 * Returns simple status indicating service is running
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.healthCheck = async (req, res, next) => {
  try {
    logger.info('Health check requested', {
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'REST API'
    };

    return res.status(200).json(formatSuccess(healthStatus, 'Service is healthy'));
  } catch (error) {
    logger.error('Health check failed', {
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Detailed system status with metrics
 * Returns comprehensive system information including memory, CPU, and process details
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.systemStatus = async (req, res, next) => {
  try {
    logger.info('System status requested', {
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = ((usedMemory / totalMemory) * 100).toFixed(2);

    const processMemory = process.memoryUsage();
    const processMemoryMB = {
      rss: (processMemory.rss / 1024 / 1024).toFixed(2),
      heapTotal: (processMemory.heapTotal / 1024 / 1024).toFixed(2),
      heapUsed: (processMemory.heapUsed / 1024 / 1024).toFixed(2),
      external: (processMemory.external / 1024 / 1024).toFixed(2)
    };

    const cpuInfo = os.cpus();
    const cpuCount = cpuInfo.length;
    const cpuModel = cpuInfo[0].model;
    const cpuSpeed = cpuInfo[0].speed;

    const loadAverage = os.loadavg();

    const systemStatus = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      uptime: {
        process: process.uptime(),
        system: os.uptime()
      },
      memory: {
        total: (totalMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        free: (freeMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        used: (usedMemory / 1024 / 1024 / 1024).toFixed(2) + ' GB',
        usagePercent: memoryUsagePercent + '%',
        process: {
          rss: processMemoryMB.rss + ' MB',
          heapTotal: processMemoryMB.heapTotal + ' MB',
          heapUsed: processMemoryMB.heapUsed + ' MB',
          external: processMemoryMB.external + ' MB'
        }
      },
      cpu: {
        count: cpuCount,
        model: cpuModel,
        speed: cpuSpeed + ' MHz',
        loadAverage: {
          '1min': loadAverage[0].toFixed(2),
          '5min': loadAverage[1].toFixed(2),
          '15min': loadAverage[2].toFixed(2)
        }
      },
      platform: {
        type: os.type(),
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        hostname: os.hostname()
      },
      process: {
        pid: process.pid,
        version: process.version,
        nodeVersion: process.versions.node,
        v8Version: process.versions.v8
      },
      environment: process.env.NODE_ENV || 'development'
    };

    logger.info('System status retrieved', {
      memoryUsage: memoryUsagePercent + '%',
      uptime: process.uptime()
    });

    return res.status(200).json(formatSuccess(systemStatus, 'System status retrieved successfully'));
  } catch (error) {
    logger.error('Failed to retrieve system status', {
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Readiness check endpoint
 * Verifies service is ready to accept traffic
 * Can be extended to check database connections, external services, etc.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.readinessCheck = async (req, res, next) => {
  try {
    logger.info('Readiness check requested', {
      ip: req.ip
    });

    const checks = {
      server: true,
      timestamp: new Date().toISOString()
    };

    const allChecksPass = Object.values(checks).every(check => check === true || typeof check === 'string');

    if (allChecksPass) {
      return res.status(200).json(formatSuccess(
        { ready: true, checks },
        'Service is ready'
      ));
    } else {
      logger.warn('Readiness check failed', { checks });
      return res.status(503).json(formatError('Service not ready', { checks }));
    }
  } catch (error) {
    logger.error('Readiness check error', {
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};

/**
 * Liveness check endpoint
 * Simple check to verify process is alive
 * Used by orchestrators (Kubernetes, Docker Swarm) to determine if container should be restarted
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.livenessCheck = async (req, res, next) => {
  try {
    return res.status(200).json(formatSuccess(
      { alive: true, timestamp: new Date().toISOString() },
      'Service is alive'
    ));
  } catch (error) {
    logger.error('Liveness check error', {
      error: error.message,
      stack: error.stack
    });
    next(error);
  }
};
