import type { Request, Response } from 'express';
import { RolesService } from './rolesService.js';
import type { RolesResponse } from './rolesModels.js';

const rolesService = new RolesService();

function toAbsoluteUrl(req: Request, urlPath: string): string {
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) return urlPath;
  const host = req.get('host');
  const protocol = req.protocol;
  return `${protocol}://${host}${urlPath}`;
}

function mapAvatarsAbsolute<T extends { teamMembers?: Array<{ avatar?: string }> }>(
  req: Request,
  item: T
): T {
  if (!item?.teamMembers) return item;
  item.teamMembers = item.teamMembers.map(tm => {
    const mapped: { [k: string]: unknown } = { ...tm };
    if (tm.avatar) {
      // Only set avatar if present to satisfy exactOptionalPropertyTypes
      (mapped as { avatar: string }).avatar = toAbsoluteUrl(req, tm.avatar);
    }
    return mapped as typeof tm;
  });
  return item;
}

export class RolesController {
  // GET /api/roles - Get all roles
  getAllRoles(req: Request, res: Response): void {
    try {
      const roles = rolesService.getAllRoles().map(r => mapAvatarsAbsolute(req, { ...r }));
      const response: RolesResponse = {
        success: true,
        data: roles,
        total: roles.length
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching roles',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/roles/:id - Get role by ID
  getRoleById(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Role ID is required'
        });
        return;
      }
      const role = rolesService.getRoleById(id);
      
      if (!role) {
        res.status(404).json({
          success: false,
          message: `Role with id ${id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: mapAvatarsAbsolute(req, { ...role })
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching role',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/roles/status/:status - Get roles by status
  getRolesByStatus(req: Request, res: Response): void {
    try {
      const { status } = req.params;
      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status is required'
        });
        return;
      }
      const roles = rolesService.getRolesByStatus(status).map(r => mapAvatarsAbsolute(req, { ...r }));
      
      const response: RolesResponse = {
        success: true,
        data: roles,
        total: roles.length
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching roles by status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/roles/type/:type - Get roles by type
  getRolesByType(req: Request, res: Response): void {
    try {
      const { type } = req.params;
      if (!type) {
        res.status(400).json({
          success: false,
          message: 'Type is required'
        });
        return;
      }
      const roles = rolesService.getRolesByType(type).map(r => mapAvatarsAbsolute(req, { ...r }));
      
      const response: RolesResponse = {
        success: true,
        data: roles,
        total: roles.length
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching roles by type',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
