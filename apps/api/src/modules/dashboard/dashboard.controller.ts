import type { NextFunction, Request, Response } from 'express';
import type { DashboardService } from './dashboard.service.js';

export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  getDashboard = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = await this.service.getDashboard();
      res.status(200).json(body);
    } catch (err) {
      next(err);
    }
  };
}
