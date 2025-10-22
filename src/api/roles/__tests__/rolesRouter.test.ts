import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import rolesRouter from '../rolesRouter.js';

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/roles', rolesRouter);

describe('Roles Router - Integration Tests', () => {
  describe('GET /api/roles', () => {
    it('should return all roles with 200 status', async () => {
      const response = await request(app).get('/api/roles');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(7);
    });

    it('should return roles with correct structure', async () => {
      const response = await request(app).get('/api/roles');
      const firstRole = response.body.data[0];

      expect(firstRole).toHaveProperty('id');
      expect(firstRole).toHaveProperty('name');
      expect(firstRole).toHaveProperty('type');
      expect(firstRole).toHaveProperty('dateCreated');
      expect(firstRole).toHaveProperty('status');
      expect(firstRole).toHaveProperty('teamMembers');
      expect(Array.isArray(firstRole.teamMembers)).toBe(true);
    });

    it('should return JSON content type', async () => {
      const response = await request(app).get('/api/roles');

      expect(response.headers['content-type']).toMatch(/json/);
    });
  });

  describe('GET /api/roles/:id', () => {
    it('should return a specific role by ID', async () => {
      const response = await request(app).get('/api/roles/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', '1');
      expect(response.body.data).toHaveProperty('name', 'Supervisors');
    });

    it('should return 404 for non-existent role', async () => {
      const response = await request(app).get('/api/roles/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('not found');
    });

    it('should return different roles for different IDs', async () => {
      const response1 = await request(app).get('/api/roles/1');
      const response2 = await request(app).get('/api/roles/2');

      expect(response1.body.data.name).toBe('Supervisors');
      expect(response2.body.data.name).toBe('Moderators');
    });
  });

  describe('GET /api/roles/status/:status', () => {
    it('should return active roles', async () => {
      const response = await request(app).get('/api/roles/status/active');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // All returned roles should have Active status
      response.body.data.forEach((role: any) => {
        expect(role.status).toBe('Active');
      });
    });

    it('should return pending roles', async () => {
      const response = await request(app).get('/api/roles/status/pending');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      
      // All returned roles should have Pending status
      response.body.data.forEach((role: any) => {
        expect(role.status).toBe('Pending');
      });
    });

    it('should be case-insensitive', async () => {
      const response1 = await request(app).get('/api/roles/status/active');
      const response2 = await request(app).get('/api/roles/status/ACTIVE');
      const response3 = await request(app).get('/api/roles/status/Active');

      expect(response1.body.data.length).toBe(response2.body.data.length);
      expect(response2.body.data.length).toBe(response3.body.data.length);
    });

    it('should return empty array for non-existent status', async () => {
      const response = await request(app).get('/api/roles/status/nonexistent');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
    });
  });

  describe('GET /api/roles/type/:type', () => {
    it('should return DEFAULT type roles', async () => {
      const response = await request(app).get('/api/roles/type/default');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // All returned roles should have DEFAULT type
      response.body.data.forEach((role: any) => {
        expect(role.type).toBe('DEFAULT');
      });
    });

    it('should return CUSTOM type roles', async () => {
      const response = await request(app).get('/api/roles/type/custom');

      expect(response.status).toBe(200);
      
      // All returned roles should have CUSTOM type
      response.body.data.forEach((role: any) => {
        expect(role.type).toBe('CUSTOM');
      });
    });

    it('should return SYSTEM_CUSTOM type roles', async () => {
      const response = await request(app).get('/api/roles/type/system_custom');

      expect(response.status).toBe(200);
      
      // All returned roles should have SYSTEM_CUSTOM type
      response.body.data.forEach((role: any) => {
        expect(role.type).toBe('SYSTEM_CUSTOM');
      });
    });

    it('should be case-insensitive', async () => {
      const response1 = await request(app).get('/api/roles/type/default');
      const response2 = await request(app).get('/api/roles/type/DEFAULT');

      expect(response1.body.data.length).toBe(response2.body.data.length);
    });

    it('should return empty array for non-existent type', async () => {
      const response = await request(app).get('/api/roles/type/nonexistent');

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
      expect(response.body.total).toBe(0);
    });
  });

  describe('Response Format', () => {
    it('should have consistent response format for all endpoints', async () => {
      const endpoints = [
        '/api/roles',
        '/api/roles/status/active',
        '/api/roles/type/default'
      ];

      for (const endpoint of endpoints) {
        const response = await request(app).get(endpoint);
        
        expect(response.body).toHaveProperty('success');
        expect(response.body).toHaveProperty('data');
        expect(response.body).toHaveProperty('total');
        expect(typeof response.body.success).toBe('boolean');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(typeof response.body.total).toBe('number');
      }
    });
  });

  describe('Data Validation', () => {
    it('should return roles with all required fields', async () => {
      const response = await request(app).get('/api/roles');
      
      response.body.data.forEach((role: any) => {
        expect(role).toHaveProperty('id');
        expect(role).toHaveProperty('name');
        expect(role).toHaveProperty('type');
        expect(role).toHaveProperty('dateCreated');
        expect(role).toHaveProperty('status');
        expect(role).toHaveProperty('teamMembers');
        
        expect(typeof role.id).toBe('string');
        expect(typeof role.name).toBe('string');
        expect(typeof role.type).toBe('string');
        expect(typeof role.dateCreated).toBe('string');
        expect(typeof role.status).toBe('string');
        expect(Array.isArray(role.teamMembers)).toBe(true);
      });
    });

    it('should return team members with all required fields', async () => {
      const response = await request(app).get('/api/roles/1');
      const teamMembers = response.body.data.teamMembers;
      
      teamMembers.forEach((member: any) => {
        expect(member).toHaveProperty('id');
        expect(member).toHaveProperty('name');
        expect(member).toHaveProperty('avatar');
        
        expect(typeof member.id).toBe('string');
        expect(typeof member.name).toBe('string');
        expect(typeof member.avatar).toBe('string');
      });
    });
  });
});
