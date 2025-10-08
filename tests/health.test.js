// File: tests/health.test.js
// Generated: 2025-10-08 11:52:03 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_xmtvzc969x5k


const app = require('../src/app');


const request = require('supertest');

describe('Health Check Endpoint', () => {
  describe('GET /health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return success true', async () => {
      const response = await request(app).get('/health');
      expect(response.body.success).toBe(true);
    });

    it('should return status healthy', async () => {
      const response = await request(app).get('/health');
      expect(response.body.data.status).toBe('healthy');
    });

    it('should return timestamp', async () => {
      const response = await request(app).get('/health');
      expect(response.body.data.timestamp).toBeDefined();
      expect(typeof response.body.data.timestamp).toBe('string');
    });

    it('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/health');
      const timestamp = new Date(response.body.data.timestamp);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });

    it('should return content-type application/json', async () => {
      const response = await request(app).get('/health');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return response within acceptable time', async () => {
      const startTime = Date.now();
      await request(app).get('/health');
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000);
    });

    it('should return consistent response structure', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status');
      expect(response.body.data).toHaveProperty('timestamp');
    });
  });

  describe('GET /health - Multiple Requests', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10).fill(null).map(() =>
        request(app).get('/health')
      );
      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    it('should return different timestamps for sequential requests', async () => {
      const response1 = await request(app).get('/health');
      await new Promise(resolve => setTimeout(resolve, 10));
      const response2 = await request(app).get('/health');
      expect(response1.body.data.timestamp).not.toBe(response2.body.data.timestamp);
    });
  });

  describe('GET /health - Error Scenarios', () => {
    it('should handle requests with query parameters gracefully', async () => {
      const response = await request(app).get('/health?test=123');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should handle requests with headers gracefully', async () => {
      const response = await request(app)
        .get('/health')
        .set('X-Custom-Header', 'test-value');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
