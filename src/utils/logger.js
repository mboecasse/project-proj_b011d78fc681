// File: src/utils/logger.js
// Generated: 2025-10-08 11:51:23 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_2zmwf3q1xsxc


const fs = require('fs');


const morgan = require('morgan');


const path = require('path');

// Create logs directory if it doesn't exist


const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create write streams for different log files


const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);


const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Custom token for response time in milliseconds
morgan.token('response-time-ms', (req, res) => {
  if (!req._startAt || !res._startAt) {
    return '0';
  }
  const ms = (res._startAt[0] - req._startAt[0]) * 1e3 +
    (res._startAt[1] - req._startAt[1]) * 1e-6;
  return ms.toFixed(3);
});

// Custom token for timestamp
morgan.token('timestamp', () => {
  return new Date().toISOString();
});

// Custom format for detailed logging


const detailedFormat = ':timestamp :remote-addr :method :url :status :response-time-ms ms - :res[content-length] bytes';

// Morgan middleware for access logs (all requests)


const accessLogger = morgan(detailedFormat, {
  stream: accessLogStream,
  skip: (req, res) => false
});

// Morgan middleware for error logs (4xx and 5xx only)


const errorLogger = morgan(detailedFormat, {
  stream: errorLogStream,
  skip: (req, res) => res.statusCode < 400
});

// Console logger for development


const consoleLogger = morgan('dev', {
  skip: () => process.env.NODE_ENV === 'production'
});

// Logger object with methods for application logging


const logger = {
  info: (message, meta = {}) => {
    const logEntry = {
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(path.join(logsDir, 'app.log'), logLine);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[INFO] ${message}`, meta);
    }
  },

  error: (message, meta = {}) => {
    const logEntry = {
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(path.join(logsDir, 'error.log'), logLine);
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[ERROR] ${message}`, meta);
    }
  },

  warn: (message, meta = {}) => {
    const logEntry = {
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    const logLine = JSON.stringify(logEntry) + '\n';
    fs.appendFileSync(path.join(logsDir, 'app.log'), logLine);
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[WARN] ${message}`, meta);
    }
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      const logEntry = {
        level: 'debug',
        timestamp: new Date().toISOString(),
        message,
        ...meta
      };
      const logLine = JSON.stringify(logEntry) + '\n';
      fs.appendFileSync(path.join(logsDir, 'debug.log'), logLine);
      console.debug(`[DEBUG] ${message}`, meta);
    }
  },

  // Morgan middleware exports
  accessLogger,
  errorLogger,
  consoleLogger
};

module.exports = logger;
