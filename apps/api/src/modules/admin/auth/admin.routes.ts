import { Router } from 'express';
import { requireAdminAuth } from '../../../middleware/require-admin-auth.js';
import { adminLoginRateLimiter } from '../../../middleware/rate-limiter.js';
import { validateBody } from '../../../middleware/validate-body.js';
import type { AdminAuthController } from './admin.controller.js';
import { adminLoginBodySchema } from './admin.validation.js';

export function createAdminAuthRouter(controller: AdminAuthController): Router {
  const router = Router();

  // Apply rate limiting to prevent brute force attacks (10 attempts per 5 min)
  router.post('/login', adminLoginRateLimiter, validateBody(adminLoginBodySchema), controller.login);
  router.get('/me', requireAdminAuth, controller.me);

  return router;
}
