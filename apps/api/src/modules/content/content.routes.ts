import { Router } from 'express';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import { validateBody } from '../../middleware/validate-body.js';
import type { ContentController } from './content.controller.js';
import { updateHomeContentBodySchema } from './content.validation.js';

export function createContentPublicRouter(controller: ContentController): Router {
  const router = Router();
  router.get('/content/home', controller.getHomeContent);
  return router;
}

export function createContentAdminRouter(controller: ContentController): Router {
  const router = Router();
  router.patch(
    '/content/home',
    requireAdminAuth,
    validateBody(updateHomeContentBodySchema),
    controller.updateHomeContent
  );
  return router;
}
