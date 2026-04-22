import { Router } from 'express';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import { validateBody } from '../../middleware/validate-body.js';
import type { ContentController } from './content.controller.js';
import { saveContentBlockBodySchema, updateHomeContentBodySchema } from './content.validation.js';

export function createContentPublicRouter(controller: ContentController): Router {
  const router = Router();
  router.get('/content/home', controller.getHomeContent);
  router.get('/content/page/:page', controller.getPageContent);
  router.get('/content/:key', controller.getBlock);
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
  router.post(
    '/content/:key',
    requireAdminAuth,
    validateBody(saveContentBlockBodySchema),
    controller.saveBlock
  );
  // Cache revalidation endpoint for Next.js ISR
  router.post('/content/revalidate/:page', requireAdminAuth, controller.revalidatePage);
  return router;
}
