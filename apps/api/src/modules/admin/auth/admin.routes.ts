import { Router } from 'express';
import { requireAdminAuth } from '../../../middleware/require-admin-auth.js';
import { validateBody } from '../../../middleware/validate-body.js';
import type { AdminAuthController } from './admin.controller.js';
import { adminLoginBodySchema } from './admin.validation.js';

export function createAdminAuthRouter(controller: AdminAuthController): Router {
  const router = Router();

  router.post('/login', validateBody(adminLoginBodySchema), controller.login);
  router.get('/me', requireAdminAuth, controller.me);

  return router;
}
