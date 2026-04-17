import { Router } from 'express';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import { validateBody } from '../../middleware/validate-body.js';
import type { MediaController } from './media.controller.js';
import { mediaUploadBodySchema } from './media.validation.js';

export function createMediaAdminRouter(controller: MediaController): Router {
  const router = Router();
  router.post(
    '/media/upload',
    requireAdminAuth,
    validateBody(mediaUploadBodySchema),
    controller.upload
  );
  return router;
}
