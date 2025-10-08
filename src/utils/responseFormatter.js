// File: src/utils/responseFormatter.js
// Generated: 2025-10-08 11:51:19 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_kskcsieenc6z

* @param {*} data - The data to return in the response
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {object} Formatted success response
 */


const success = (data = null, message = 'Success', statusCode = 200) => {
  return {
    response: {
      success: true,
      data,
      message
    },
    statusCode
  };
};

/**
 * Format an error response
 *
 * @param {string} error - Error message to return
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {object} details - Optional additional error details (not exposed in production)
 * @returns {object} Formatted error response
 */


const error = (error = 'An error occurred', statusCode = 500, details = null) => {
  const response = {
    success: false,
    error
  };

  if (details && process.env.NODE_ENV !== 'production') {
    response.details = details;
  }

  return {
    response,
    statusCode
  };
};

/**
 * Format a paginated response
 *
 * @param {Array} data - Array of items for current page
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @param {string} message - Optional success message
 * @returns {object} Formatted paginated response
 */


const paginated = (data, page, limit, total, message = 'Success') => {
  const totalPages = Math.ceil(total / limit);

  return {
    response: {
      success: true,
      data,
      message,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    },
    statusCode: 200
  };
};

/**
 * Format a created resource response
 *
 * @param {*} data - The created resource data
 * @param {string} message - Optional success message
 * @returns {object} Formatted created response
 */


const created = (data, message = 'Resource created successfully') => {
  return success(data, message, 201);
};

/**
 * Format a no content response
 *
 * @param {string} message - Optional success message
 * @returns {object} Formatted no content response
 */


const noContent = (message = 'Operation completed successfully') => {
  return {
    response: {
      success: true,
      message
    },
    statusCode: 204
  };
};

/**
 * Format a not found response
 *
 * @param {string} resource - Name of the resource that was not found
 * @returns {object} Formatted not found response
 */


const notFound = (resource = 'Resource') => {
  return error(`${resource} not found`, 404);
};

/**
 * Format a bad request response
 *
 * @param {string} message - Error message describing the bad request
 * @param {object} validationErrors - Optional validation error details
 * @returns {object} Formatted bad request response
 */


const badRequest = (message = 'Bad request', validationErrors = null) => {
  return error(message, 400, validationErrors);
};

/**
 * Format an unauthorized response
 *
 * @param {string} message - Optional error message
 * @returns {object} Formatted unauthorized response
 */


const unauthorized = (message = 'Unauthorized access') => {
  return error(message, 401);
};

/**
 * Format a forbidden response
 *
 * @param {string} message - Optional error message
 * @returns {object} Formatted forbidden response
 */


const forbidden = (message = 'Access forbidden') => {
  return error(message, 403);
};

/**
 * Format a conflict response
 *
 * @param {string} message - Error message describing the conflict
 * @returns {object} Formatted conflict response
 */


const conflict = (message = 'Resource conflict') => {
  return error(message, 409);
};

/**
 * Format an internal server error response
 *
 * @param {string} message - Optional error message
 * @param {object} details - Optional error details (not exposed in production)
 * @returns {object} Formatted internal server error response
 */


const serverError = (message = 'Internal server error', details = null) => {
  return error(message, 500, details);
};

/**
 * Send formatted response to client
 *
 * @param {object} res - Express response object
 * @param {object} formattedResponse - Response object from formatter functions
 */


const send = (res, formattedResponse) => {
  const { response, statusCode } = formattedResponse;
  res.status(statusCode).json(response);
};

module.exports = {
  success,
  error,
  paginated,
  created,
  noContent,
  notFound,
  badRequest,
  unauthorized,
  forbidden,
  conflict,
  serverError,
  send
};
