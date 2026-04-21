import { Router } from 'express';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import { requireAdminRole } from '../../middleware/require-admin-role.js';
import { validateBody } from '../../middleware/validate-body.js';
import type { ProgramsController } from './programs.controller.js';
import { createProgramBodySchema, updateProgramBodySchema } from './programs.validation.js';

export function createProgramsAdminRouter(controller: ProgramsController): Router {
  const router = Router();
  router.get('/programs', requireAdminAuth, controller.listAdmin);
  router.post(
    '/programs',
    requireAdminAuth,
    validateBody(createProgramBodySchema),
    controller.create
  );
  router.patch(
    '/programs/:id',
    requireAdminAuth,
    validateBody(updateProgramBodySchema),
    controller.update
  );
  router.delete(
    '/programs/:id',
    requireAdminAuth,
    requireAdminRole(['super_admin']),
    controller.remove
  );
  return router;
}

export function createProgramsPublicRouter(controller: ProgramsController): Router {
  const router = Router();
  router.get('/programs', controller.listPublic);
  router.get('/programs/:slug', controller.getBySlug);
  return router;
}
