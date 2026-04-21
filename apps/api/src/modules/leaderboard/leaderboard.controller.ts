import type { NextFunction, Request, Response } from 'express';
import type { LeaderboardService } from './leaderboard.service.js';
import type { ReplaceLeaderboardEntry } from './leaderboard.repository.js';

type SyncBody = {
  entries: Array<{
    name: string;
    githubUsername?: string | null;
    commits?: number;
    repos?: number;
    score?: number;
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
      const entries: ReplaceLeaderboardEntry[] = body.entries.map((entry) => ({
        name: entry.name,
        githubUsername: entry.githubUsername,
        commits: entry.commits,
        repos: entry.repos,
        score: entry.score ?? 0,
        rank: entry.rank,
        notes: entry.notes,
      }));
      const result = await this.service.sync(entries);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
