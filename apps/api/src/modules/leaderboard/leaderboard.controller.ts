import type { NextFunction, Request, Response } from 'express';
import type { LeaderboardService } from './leaderboard.service.js';

type SyncBody = {
  entries: Array<{
    name: string;
    githubUsername?: string | null;
    score: number;
    rank?: number;
    notes?: string;
  }>;
};

export class LeaderboardController {
  constructor(private readonly service: LeaderboardService) {}

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await this.service.list();
      res.status(200).json({ items });
    } catch (err) {
      next(err);
    }
  };

  sync = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as SyncBody;
      const result = await this.service.sync(body.entries);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
