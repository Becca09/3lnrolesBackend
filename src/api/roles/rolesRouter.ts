import { Router } from 'express';
import { RolesController } from './rolesController.js';

const router = Router();
const rolesController = new RolesController();

// GET /api/roles - Get all roles
router.get('/', (req, res) => rolesController.getAllRoles(req, res));

// GET /api/roles/:id - Get role by ID
router.get('/:id', (req, res) => rolesController.getRoleById(req, res));

// GET /api/roles/status/:status - Get roles by status (active, inactive, pending)
router.get('/status/:status', (req, res) => rolesController.getRolesByStatus(req, res));

// GET /api/roles/type/:type - Get roles by type (default, custom, system_custom)
router.get('/type/:type', (req, res) => rolesController.getRolesByType(req, res));

export default router;
