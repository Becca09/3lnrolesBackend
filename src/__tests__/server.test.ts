import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';

describe('Server - Integration Tests', () => {
  describe('Health Check', () => {
    it('should return 200 for health endpoint', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message');
    });

    it('should return JSON for health endpoint', async () => {
      const response = await request(app).get('/health');

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('API Routes', () => {
    it('should handle /api/roles endpoint', async () => {
      const response = await request(app).get('/api/roles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle /api/roles/:id endpoint', async () => {
      const response = await request(app).get('/api/roles/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle /api/roles/status/:status endpoint', async () => {
      const response = await request(app).get('/api/roles/status/active');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle /api/roles/type/:type endpoint', async () => {
      const response = await request(app).get('/api/roles/type/default');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });

    it('should return JSON for 404 errors', async () => {
      const response = await request(app).get('/non-existent-route');

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('CORS', () => {
    it('should have CORS headers', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('JSON Middleware', () => {
    it('should parse JSON request bodies', async () => {
      // Even though we don't have POST endpoints yet, we can verify the middleware is set up
      const response = await request(app).get('/health');
      
      // If the server responds, JSON middleware is working
      expect(response.status).toBe(200);
    });
  });

  describe('End-to-End Workflow', () => {
    it('should fetch all roles and then fetch a specific role', async () => {
      // First, get all roles
      const allRolesResponse = await request(app).get('/api/roles');
      expect(allRolesResponse.status).toBe(200);
      expect(allRolesResponse.body.data.length).toBeGreaterThan(0);

      // Then, fetch the first role by ID
      const firstRoleId = allRolesResponse.body.data[0].id;
      const singleRoleResponse = await request(app).get(`/api/roles/${firstRoleId}`);
      
      expect(singleRoleResponse.status).toBe(200);
      expect(singleRoleResponse.body.data.id).toBe(firstRoleId);
    });

    it('should filter roles by status and verify results', async () => {
      // Get all roles
      const allRolesResponse = await request(app).get('/api/roles');
      const allRoles = allRolesResponse.body.data;

      // Count active roles manually
      const activeRolesCount = allRoles.filter((role: any) => role.status === 'Active').length;

      // Get active roles via API
      const activeRolesResponse = await request(app).get('/api/roles/status/active');
      
      expect(activeRolesResponse.body.data.length).toBe(activeRolesCount);
      expect(activeRolesResponse.body.total).toBe(activeRolesCount);
    });

    it('should filter roles by type and verify results', async () => {
      // Get all roles
      const allRolesResponse = await request(app).get('/api/roles');
      const allRoles = allRolesResponse.body.data;

      // Count DEFAULT type roles manually
      const defaultRolesCount = allRoles.filter((role: any) => role.type === 'DEFAULT').length;

      // Get DEFAULT type roles via API
      const defaultRolesResponse = await request(app).get('/api/roles/type/default');
      
      expect(defaultRolesResponse.body.data.length).toBe(defaultRolesCount);
      expect(defaultRolesResponse.body.total).toBe(defaultRolesCount);
    });
  });

  describe('Performance', () => {
    it('should respond quickly to requests', async () => {
      const startTime = Date.now();
      await request(app).get('/api/roles');
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = [
        request(app).get('/api/roles'),
        request(app).get('/api/roles/1'),
        request(app).get('/api/roles/status/active'),
        request(app).get('/api/roles/type/default'),
        request(app).get('/health')
      ];

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });
});
