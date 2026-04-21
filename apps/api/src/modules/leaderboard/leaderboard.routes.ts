import { Router } from 'express';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import { requireAdminRole } from '../../middleware/require-admin-role.js';
import { validateBody } from '../../middleware/validate-body.js';
import type { LeaderboardController } from './leaderboard.controller.js';
import { leaderboardSyncBodySchema } from './leaderboard.validation.js';

export function createLeaderboardAdminRouter(controller: LeaderboardController): Router {
  const router = Router();
  router.post(
    '/leaderboard/sync',
    requireAdminAuth,
    requireAdminRole(['super_admin']),
    validateBody(leaderboardSyncBodySchema),
    controller.sync
  );
  return router;
}

export function createLeaderboardPublicRouter(controller: LeaderboardController): Router {
  const router = Router();
  router.get('/leaderboard', controller.list);
  return router;
}
