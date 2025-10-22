import { describe, it, expect, beforeEach } from '@jest/globals';
import { RolesService } from '../rolesService.js';

describe('RolesService', () => {
  let rolesService: RolesService;

  beforeEach(() => {
    rolesService = new RolesService();
  });

  describe('getAllRoles', () => {
    it('should return all roles', () => {
      const roles = rolesService.getAllRoles();
      
      expect(roles).toBeDefined();
      expect(Array.isArray(roles)).toBe(true);
      expect(roles.length).toBe(7);
    });

    it('should return roles with correct structure', () => {
      const roles = rolesService.getAllRoles();
      const firstRole = roles[0]!;

      expect(firstRole).toHaveProperty('id');
      expect(firstRole).toHaveProperty('name');
      expect(firstRole).toHaveProperty('type');
      expect(firstRole).toHaveProperty('dateCreated');
      expect(firstRole).toHaveProperty('status');
      expect(firstRole).toHaveProperty('teamMembers');
      expect(Array.isArray(firstRole.teamMembers)).toBe(true);
    });

    it('should return roles with team members having correct structure', () => {
      const roles = rolesService.getAllRoles();
      const firstMember = roles[0]?.teamMembers[0];

      expect(firstMember).toHaveProperty('id');
      expect(firstMember).toHaveProperty('name');
      expect(firstMember).toHaveProperty('avatar');
    });
  });

  describe('getRoleById', () => {
    it('should return a role when valid ID is provided', () => {
      const role = rolesService.getRoleById('1');
      
      expect(role).toBeDefined();
      expect(role?.id).toBe('1');
      expect(role?.name).toBe('Supervisors');
    });

    it('should return undefined when role does not exist', () => {
      const role = rolesService.getRoleById('999');
      
      expect(role).toBeUndefined();
    });

    it('should return correct role for each valid ID', () => {
      const role1 = rolesService.getRoleById('1');
      const role2 = rolesService.getRoleById('2');
      const role7 = rolesService.getRoleById('7');

      expect(role1?.name).toBe('Supervisors');
      expect(role2?.name).toBe('Moderators');
      expect(role7?.name).toBe('Developer-basic');
    });
  });

  describe('getRolesByStatus', () => {
    it('should return all active roles', () => {
      const activeRoles = rolesService.getRolesByStatus('active');
      
      expect(activeRoles).toBeDefined();
      expect(Array.isArray(activeRoles)).toBe(true);
      expect(activeRoles.length).toBeGreaterThan(0);
      expect(activeRoles.every(role => role.status === 'Active')).toBe(true);
    });

    it('should return all pending roles', () => {
      const pendingRoles = rolesService.getRolesByStatus('pending');
      
      expect(pendingRoles).toBeDefined();
      expect(Array.isArray(pendingRoles)).toBe(true);
      expect(pendingRoles.every(role => role.status === 'Pending')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const activeRoles1 = rolesService.getRolesByStatus('active');
      const activeRoles2 = rolesService.getRolesByStatus('ACTIVE');
      const activeRoles3 = rolesService.getRolesByStatus('Active');

      expect(activeRoles1.length).toBe(activeRoles2.length);
      expect(activeRoles2.length).toBe(activeRoles3.length);
    });

    it('should return empty array for non-existent status', () => {
      const roles = rolesService.getRolesByStatus('nonexistent');
      
      expect(roles).toBeDefined();
      expect(Array.isArray(roles)).toBe(true);
      expect(roles.length).toBe(0);
    });
  });

  describe('getRolesByType', () => {
    it('should return all DEFAULT type roles', () => {
      const defaultRoles = rolesService.getRolesByType('default');
      
      expect(defaultRoles).toBeDefined();
      expect(Array.isArray(defaultRoles)).toBe(true);
      expect(defaultRoles.length).toBeGreaterThan(0);
      expect(defaultRoles.every(role => role.type === 'DEFAULT')).toBe(true);
    });

    it('should return all CUSTOM type roles', () => {
      const customRoles = rolesService.getRolesByType('custom');
      
      expect(customRoles).toBeDefined();
      expect(Array.isArray(customRoles)).toBe(true);
      expect(customRoles.every(role => role.type === 'CUSTOM')).toBe(true);
    });

    it('should return all SYSTEM_CUSTOM type roles', () => {
      const systemCustomRoles = rolesService.getRolesByType('system_custom');
      
      expect(systemCustomRoles).toBeDefined();
      expect(Array.isArray(systemCustomRoles)).toBe(true);
      expect(systemCustomRoles.every(role => role.type === 'SYSTEM_CUSTOM')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const defaultRoles1 = rolesService.getRolesByType('default');
      const defaultRoles2 = rolesService.getRolesByType('DEFAULT');
      const defaultRoles3 = rolesService.getRolesByType('Default');

      expect(defaultRoles1.length).toBe(defaultRoles2.length);
      expect(defaultRoles2.length).toBe(defaultRoles3.length);
    });

    it('should return empty array for non-existent type', () => {
      const roles = rolesService.getRolesByType('nonexistent');
      
      expect(roles).toBeDefined();
      expect(Array.isArray(roles)).toBe(true);
      expect(roles.length).toBe(0);
    });
  });

  describe('Data Integrity', () => {
    it('should have correct total count of roles', () => {
      const allRoles = rolesService.getAllRoles();
      expect(allRoles.length).toBe(7);
    });

    it('should have at least one role of each type', () => {
      const defaultRoles = rolesService.getRolesByType('default');
      const customRoles = rolesService.getRolesByType('custom');
      const systemCustomRoles = rolesService.getRolesByType('system_custom');

      expect(defaultRoles.length).toBeGreaterThan(0);
      expect(customRoles.length).toBeGreaterThan(0);
      expect(systemCustomRoles.length).toBeGreaterThan(0);
    });

    it('should have all roles with team members', () => {
      const allRoles = rolesService.getAllRoles();
      
      allRoles.forEach(role => {
        expect(role.teamMembers).toBeDefined();
        expect(Array.isArray(role.teamMembers)).toBe(true);
        expect(role.teamMembers.length).toBeGreaterThan(0);
      });
    });

    it('should have unique role IDs', () => {
      const allRoles = rolesService.getAllRoles();
      const ids = allRoles.map(role => role.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    });
  });
});
