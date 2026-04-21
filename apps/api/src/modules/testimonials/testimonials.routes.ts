import { Router } from 'express';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import { requireAdminRole } from '../../middleware/require-admin-role.js';
import { validateBody } from '../../middleware/validate-body.js';
import type { TestimonialsController } from './testimonials.controller.js';
import {
  createTestimonialBodySchema,
  updateTestimonialBodySchema,
} from './testimonials.validation.js';

export function createTestimonialsAdminRouter(controller: TestimonialsController): Router {
  const router = Router();
  router.get('/testimonials', requireAdminAuth, controller.listAdmin);
  router.post(
    '/testimonials',
    requireAdminAuth,
    validateBody(createTestimonialBodySchema),
    controller.create
  );
  router.patch(
    '/testimonials/:id',
    requireAdminAuth,
    validateBody(updateTestimonialBodySchema),
    controller.update
  );
  router.delete(
    '/testimonials/:id',
    requireAdminAuth,
    requireAdminRole(['super_admin']),
    controller.remove
  );
  return router;
}

export function createTestimonialsPublicRouter(controller: TestimonialsController): Router {
  const router = Router();
  router.get('/testimonials', controller.listPublic);
  return router;
}
