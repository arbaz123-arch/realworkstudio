import { Router } from 'express';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import type { DashboardController } from './dashboard.controller.js';

export function createDashboardRouter(controller: DashboardController): Router {
  const router = Router();
  router.get('/dashboard', requireAdminAuth, controller.getDashboard);
  return router;
}
