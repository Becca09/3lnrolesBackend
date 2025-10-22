import type { Role } from './rolesModels.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load roles data from JSON file
const rolesDataPath = join(__dirname, '../../data/roles.json');
const mockRoles: Role[] = JSON.parse(readFileSync(rolesDataPath, 'utf-8'));

export class RolesService {
  // Get all roles
  getAllRoles(): Role[] {
    return mockRoles;
  }

  // Get role by ID
  getRoleById(id: string): Role | undefined {
    return mockRoles.find(role => role.id === id);
  }

  // Get roles by status
  getRolesByStatus(status: string): Role[] {
    return mockRoles.filter(role => role.status.toLowerCase() === status.toLowerCase());
  }

  // Get roles by type
  getRolesByType(type: string): Role[] {
    return mockRoles.filter(role => role.type.toLowerCase() === type.toLowerCase());
  }
}
