// File: src/validators/testEntityValidator.js
// Generated: 2025-10-08 11:51:18 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_txu9svon3dpl


const { body, param, query } = require('express-validator');


const createTestEntityValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Name can only contain letters, numbers, spaces, hyphens, and underscores'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .trim()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('Status must be one of: active, inactive, pending'),

  body('value')
    .optional()
    .isNumeric()
    .withMessage('Value must be a number')
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Value must be between 0 and 999999.99'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > 50) {
          throw new Error('Each tag must be a string with max 50 characters');
        }
      }
      return true;
    }),

  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
    .custom((metadata) => {
      const keys = Object.keys(metadata);
      if (keys.length > 20) {
        throw new Error('Metadata cannot have more than 20 properties');
      }
      return true;
    })
];


const updateTestEntityValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isMongoId()
    .withMessage('Invalid ID format'),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage('Name can only contain letters, numbers, spaces, hyphens, and underscores'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('status')
    .optional()
    .trim()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('Status must be one of: active, inactive, pending'),

  body('value')
    .optional()
    .isNumeric()
    .withMessage('Value must be a number')
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Value must be between 0 and 999999.99'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error('Cannot have more than 10 tags');
      }
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > 50) {
          throw new Error('Each tag must be a string with max 50 characters');
        }
      }
      return true;
    }),

  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object')
    .custom((metadata) => {
      const keys = Object.keys(metadata);
      if (keys.length > 20) {
        throw new Error('Metadata cannot have more than 20 properties');
      }
      return true;
    }),

  body()
    .custom((body) => {
      const allowedFields = ['name', 'description', 'status', 'value', 'tags', 'metadata'];
      const providedFields = Object.keys(body);
      const hasValidField = providedFields.some(field => allowedFields.includes(field));
      if (!hasValidField) {
        throw new Error('At least one valid field must be provided for update');
      }
      return true;
    })
];


const getTestEntityValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isMongoId()
    .withMessage('Invalid ID format')
];


const deleteTestEntityValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID parameter is required')
    .isMongoId()
    .withMessage('Invalid ID format')
];


const listTestEntitiesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('status')
    .optional()
    .trim()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('Status must be one of: active, inactive, pending'),

  query('sortBy')
    .optional()
    .trim()
    .isIn(['name', 'createdAt', 'updatedAt', 'value', 'status'])
    .withMessage('SortBy must be one of: name, createdAt, updatedAt, value, status'),

  query('sortOrder')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('SortOrder must be either asc or desc'),

  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query cannot exceed 100 characters')
];

module.exports = {
  createTestEntityValidation,
  updateTestEntityValidation,
  getTestEntityValidation,
  deleteTestEntityValidation,
  listTestEntitiesValidation
};
