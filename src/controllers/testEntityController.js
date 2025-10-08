// File: src/controllers/testEntityController.js
// Generated: 2025-10-08 11:51:36 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_arpgwhm9hi9x


const logger = require('../utils/logger');


const testEntityModel = require('../models/testEntity');

const { formatSuccess, formatError } = require('../utils/responseFormatter');

exports.getAll = async (req, res, next) => {
  try {
    logger.info('Fetching all test entities');
    const entities = await testEntityModel.getAll();
    logger.info('Successfully retrieved test entities', { count: entities.length });
    return res.status(200).json(formatSuccess(entities, 'Test entities retrieved successfully'));
  } catch (error) {
    logger.error('Failed to fetch test entities', { error: error.message, stack: error.stack });
    return res.status(500).json(formatError('Failed to retrieve test entities'));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Fetching test entity by ID', { id });

    const entity = await testEntityModel.getById(id);

    if (!entity) {
      logger.warn('Test entity not found', { id });
      return res.status(404).json(formatError('Test entity not found'));
    }

    logger.info('Successfully retrieved test entity', { id });
    return res.status(200).json(formatSuccess(entity, 'Test entity retrieved successfully'));
  } catch (error) {
    logger.error('Failed to fetch test entity', { id: req.params.id, error: error.message, stack: error.stack });
    return res.status(500).json(formatError('Failed to retrieve test entity'));
  }
};

exports.create = async (req, res, next) => {
  try {
    const entityData = req.body;
    logger.info('Creating new test entity', { data: entityData });

    const newEntity = await testEntityModel.create(entityData);

    logger.info('Successfully created test entity', { id: newEntity.id });
    return res.status(201).json(formatSuccess(newEntity, 'Test entity created successfully'));
  } catch (error) {
    logger.error('Failed to create test entity', { data: req.body, error: error.message, stack: error.stack });
    return res.status(500).json(formatError('Failed to create test entity'));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    logger.info('Updating test entity', { id, data: updateData });

    const updatedEntity = await testEntityModel.update(id, updateData);

    if (!updatedEntity) {
      logger.warn('Test entity not found for update', { id });
      return res.status(404).json(formatError('Test entity not found'));
    }

    logger.info('Successfully updated test entity', { id });
    return res.status(200).json(formatSuccess(updatedEntity, 'Test entity updated successfully'));
  } catch (error) {
    logger.error('Failed to update test entity', { id: req.params.id, data: req.body, error: error.message, stack: error.stack });
    return res.status(500).json(formatError('Failed to update test entity'));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info('Deleting test entity', { id });

    const deleted = await testEntityModel.delete(id);

    if (!deleted) {
      logger.warn('Test entity not found for deletion', { id });
      return res.status(404).json(formatError('Test entity not found'));
    }

    logger.info('Successfully deleted test entity', { id });
    return res.status(200).json(formatSuccess(null, 'Test entity deleted successfully'));
  } catch (error) {
    logger.error('Failed to delete test entity', { id: req.params.id, error: error.message, stack: error.stack });
    return res.status(500).json(formatError('Failed to delete test entity'));
  }
};
