import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import type { Request, Response } from 'express';
import { RolesController } from '../rolesController.js';

// Mock the RolesService
jest.mock('../rolesService.js');

describe('RolesController', () => {
  let rolesController: RolesController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    rolesController = new RolesController();
    
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {
      params: {},
    };
    
    mockResponse = {
      status: mockStatus as any,
      json: mockJson,
    };
  });

  describe('getAllRoles', () => {
    it('should return all roles with 200 status', () => {
      rolesController.getAllRoles(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalled();
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('total');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should return correct total count', () => {
      rolesController.getAllRoles(mockRequest as Request, mockResponse as Response);

      const response = mockJson.mock.calls[0]?.[0];
      expect(response.total).toBe(response.data.length);
    });
  });

  describe('getRoleById', () => {
    it('should return a role when valid ID is provided', () => {
      mockRequest.params = { id: '1' };

      rolesController.getRoleById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalled();
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('data');
      expect(response.data).toHaveProperty('id', '1');
    });

    it('should return 404 when role is not found', () => {
      mockRequest.params = { id: '999' };

      rolesController.getRoleById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalled();
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('message');
    });

    it('should return 400 when ID is not provided', () => {
      mockRequest.params = {};

      rolesController.getRoleById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalled();
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response).toHaveProperty('success', false);
      expect(response.message).toContain('required');
    });
  });

  describe('getRolesByStatus', () => {
    it('should return roles filtered by status', () => {
      mockRequest.params = { status: 'active' };

      rolesController.getRolesByStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalled();
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('total');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should return 400 when status is not provided', () => {
      mockRequest.params = {};

      rolesController.getRolesByStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalled();
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response).toHaveProperty('success', false);
      expect(response.message).toContain('required');
    });

    it('should return empty array for non-existent status', () => {
      mockRequest.params = { status: 'nonexistent' };

      rolesController.getRolesByStatus(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response.data).toEqual([]);
      expect(response.total).toBe(0);
    });
  });

  describe('getRolesByType', () => {
    it('should return roles filtered by type', () => {
      mockRequest.params = { type: 'default' };

      rolesController.getRolesByType(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalled();
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('total');
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should return 400 when type is not provided', () => {
      mockRequest.params = {};

      rolesController.getRolesByType(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalled();
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response).toHaveProperty('success', false);
      expect(response.message).toContain('required');
    });

    it('should return empty array for non-existent type', () => {
      mockRequest.params = { type: 'nonexistent' };

      rolesController.getRolesByType(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(200);
      
      const response = mockJson.mock.calls[0]?.[0];
      expect(response.data).toEqual([]);
      expect(response.total).toBe(0);
    });
  });

  describe('Response Structure', () => {
    it('should return consistent response structure', () => {
      rolesController.getAllRoles(mockRequest as Request, mockResponse as Response);

      const response = mockJson.mock.calls[0]?.[0];
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('total');
      expect(typeof response.success).toBe('boolean');
      expect(Array.isArray(response.data)).toBe(true);
      expect(typeof response.total).toBe('number');
    });
  });
});
