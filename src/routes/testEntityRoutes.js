// File: src/routes/testEntityRoutes.js
// Generated: 2025-10-08 11:51:13 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_q2fzt3vut7p3


const express = require('express');


const testEntityController = require('../controllers/testEntityController');

const { body, param, query } = require('express-validator');

const { validate } = require('../middleware/validationMiddleware');


const router = express.Router();

// Validation rules


const createTestEntityValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('Status must be active, inactive, or pending'),
  body('value')
    .optional()
    .isNumeric()
    .withMessage('Value must be a number')
];


const updateTestEntityValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('Invalid ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('Status must be active, inactive, or pending'),
  body('value')
    .optional()
    .isNumeric()
    .withMessage('Value must be a number')
];


const idParamValidation = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('Invalid ID format')
];


const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['active', 'inactive', 'pending'])
    .withMessage('Status must be active, inactive, or pending'),
  query('sortBy')
    .optional()
    .isIn(['name', 'createdAt', 'updatedAt', 'value'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
];

// Routes
router.get('/', queryValidation, validate, testEntityController.getAllTestEntities);
router.get('/:id', idParamValidation, validate, testEntityController.getTestEntityById);
router.post('/', createTestEntityValidation, validate, testEntityController.createTestEntity);
router.put('/:id', updateTestEntityValidation, validate, testEntityController.updateTestEntity);
router.delete('/:id', idParamValidation, validate, testEntityController.deleteTestEntity);

module.exports = router;
