// File: src/config/env.js
// Generated: 2025-10-08 11:51:14 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_1tj7emlhv726


const dotenv = require('dotenv');


const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Environment configuration validator and loader
 * SINGLE source of truth for all environment variables
 */

// Required environment variables


const requiredEnvVars = [
  'NODE_ENV',
  'PORT'
];

// Optional environment variables with defaults


const optionalEnvVars = {
  LOG_LEVEL: 'info',
  API_PREFIX: '/api',
  RATE_LIMIT_WINDOW_MS: '900000',
  RATE_LIMIT_MAX_REQUESTS: '100'
};

/**
 * Validates that all required environment variables are present
 * @throws {Error} If required environment variables are missing
 */


function validateEnv() {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please ensure these are set in your .env file'
    );
  }
}

/**
 * Gets environment variable value with optional default
 * @param {string} key - Environment variable name
 * @param {string} defaultValue - Default value if not set
 * @returns {string} Environment variable value
 */


function getEnvVar(key, defaultValue = undefined) {
  const value = process.env[key];
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not set and has no default`);
  }
  return value || defaultValue;
}

/**
 * Parses string to integer with validation
 * @param {string} value - String value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed integer
 */


function parseIntEnv(value, defaultValue) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parses string to boolean
 * @param {string} value - String value to parse
 * @returns {boolean} Parsed boolean
 */


function parseBoolEnv(value) {
  return value === 'true' || value === '1';
}

// Validate required variables
validateEnv();

// Export configuration object
module.exports = {
  // Application
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  port: parseIntEnv(getEnvVar('PORT'), 3000),
  apiPrefix: getEnvVar('API_PREFIX', optionalEnvVars.API_PREFIX),

  // Logging
  logLevel: getEnvVar('LOG_LEVEL', optionalEnvVars.LOG_LEVEL),

  // Rate Limiting
  rateLimit: {
    windowMs: parseIntEnv(
      getEnvVar('RATE_LIMIT_WINDOW_MS', optionalEnvVars.RATE_LIMIT_WINDOW_MS),
      900000
    ),
    maxRequests: parseIntEnv(
      getEnvVar('RATE_LIMIT_MAX_REQUESTS', optionalEnvVars.RATE_LIMIT_MAX_REQUESTS),
      100
    )
  },

  // CORS
  corsOrigin: getEnvVar('CORS_ORIGIN', '*'),

  // Helper methods
  isDevelopment: () => module.exports.nodeEnv === 'development',
  isProduction: () => module.exports.nodeEnv === 'production',
  isTest: () => module.exports.nodeEnv === 'test',

  /**
   * Gets raw environment variable (use sparingly)
   * @param {string} key - Environment variable name
   * @returns {string|undefined} Raw environment variable value
   */
  getRaw: (key) => process.env[key]
};
