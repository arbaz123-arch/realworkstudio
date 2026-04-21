import type { NextFunction, Request, Response } from 'express';
import type { AdminRole } from '../types/admin.js';

export function requireAdminRole(allowed: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.admin?.role;
    if (role === undefined || !allowed.includes(role)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  };
}

