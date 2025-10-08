// File: tests/testEntity.test.js
// Generated: 2025-10-08 11:52:13 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_u2pnvnvpgls4


const app = require('../src/app');


const request = require('supertest');

describe('Test Entity CRUD Endpoints', () => {
  let createdEntityId;

  describe('POST /api/test-entities', () => {
    it('should create a new test entity', async () => {
      const newEntity = {
        name: 'Test Entity',
        description: 'Test Description',
        value: 100
      };

      const response = await request(app)
        .post('/api/test-entities')
        .send(newEntity)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newEntity.name);
      expect(response.body.data.description).toBe(newEntity.description);
      expect(response.body.data.value).toBe(newEntity.value);
      expect(response.body.message).toBe('Test entity created successfully');

      createdEntityId = response.body.data.id;
    });

    it('should return 400 for invalid input', async () => {
      const invalidEntity = {
        name: '',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/test-entities')
        .send(invalidEntity)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteEntity = {
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/test-entities')
        .send(incompleteEntity)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/test-entities', () => {
    it('should retrieve all test entities', async () => {
      const response = await request(app)
        .get('/api/test-entities')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.message).toBe('Test entities retrieved successfully');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/test-entities?page=1&limit=5')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should support filtering', async () => {
      const response = await request(app)
        .get('/api/test-entities?name=Test')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/test-entities/:id', () => {
    it('should retrieve a single test entity by id', async () => {
      const response = await request(app)
        .get(`/api/test-entities/${createdEntityId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', createdEntityId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('description');
      expect(response.body.message).toBe('Test entity retrieved successfully');
    });

    it('should return 404 for non-existent id', async () => {
      const nonExistentId = '99999';

      const response = await request(app)
        .get(`/api/test-entities/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Test entity not found');
    });

    it('should return 400 for invalid id format', async () => {
      const invalidId = 'invalid-id';

      const response = await request(app)
        .get(`/api/test-entities/${invalidId}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/test-entities/:id', () => {
    it('should update an existing test entity', async () => {
      const updatedData = {
        name: 'Updated Test Entity',
        description: 'Updated Description',
        value: 200
      };

      const response = await request(app)
        .put(`/api/test-entities/${createdEntityId}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', createdEntityId);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.description).toBe(updatedData.description);
      expect(response.body.data.value).toBe(updatedData.value);
      expect(response.body.message).toBe('Test entity updated successfully');
    });

    it('should return 404 for non-existent id', async () => {
      const nonExistentId = '99999';
      const updatedData = {
        name: 'Updated Name',
        description: 'Updated Description',
        value: 150
      };

      const response = await request(app)
        .put(`/api/test-entities/${nonExistentId}`)
        .send(updatedData)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Test entity not found');
    });

    it('should return 400 for invalid input', async () => {
      const invalidData = {
        name: '',
        description: 'Test Description'
      };

      const response = await request(app)
        .put(`/api/test-entities/${createdEntityId}`)
        .send(invalidData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should allow partial updates', async () => {
      const partialUpdate = {
        description: 'Partially Updated Description'
      };

      const response = await request(app)
        .put(`/api/test-entities/${createdEntityId}`)
        .send(partialUpdate)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.description).toBe(partialUpdate.description);
    });
  });

  describe('DELETE /api/test-entities/:id', () => {
    it('should delete an existing test entity', async () => {
      const response = await request(app)
        .delete(`/api/test-entities/${createdEntityId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Test entity deleted successfully');
    });

    it('should return 404 for non-existent id', async () => {
      const nonExistentId = '99999';

      const response = await request(app)
        .delete(`/api/test-entities/${nonExistentId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Test entity not found');
    });

    it('should return 404 when trying to delete already deleted entity', async () => {
      const response = await request(app)
        .delete(`/api/test-entities/${createdEntityId}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Test entity not found');
    });

    it('should return 400 for invalid id format', async () => {
      const invalidId = 'invalid-id';

      const response = await request(app)
        .delete(`/api/test-entities/${invalidId}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      const response = await request(app)
        .get('/api/test-entities/trigger-error')
        .expect('Content-Type', /json/);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });
  });
});
