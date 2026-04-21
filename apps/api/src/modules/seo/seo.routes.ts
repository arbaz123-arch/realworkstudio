import { Router } from 'express';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import { validateBody } from '../../middleware/validate-body.js';
import type { SeoController } from './seo.controller.js';
import { saveSeoBodySchema } from './seo.validation.js';

export function createSeoPublicRouter(controller: SeoController): Router {
  const router = Router();
  router.get('/seo', controller.getByPage);
  return router;
}

export function createSeoAdminRouter(controller: SeoController): Router {
  const router = Router();
  router.post('/seo', requireAdminAuth, validateBody(saveSeoBodySchema), controller.save);
  return router;
}

