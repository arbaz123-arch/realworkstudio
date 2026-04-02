import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../../middleware/error-handler.js';
import type { AdminAuthService } from './admin.service.js';

export class AdminAuthController {
  constructor(private readonly service: AdminAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as { email: string; password: string };
      const result = await this.service.login(body.email, body.password);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const admin = req.admin;
      if (admin === undefined) {
        throw new HttpError(401, 'Unauthorized');
      }
      res.status(200).json({
        user: {
          id: admin.sub,
          email: admin.email,
          role: admin.role,
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
