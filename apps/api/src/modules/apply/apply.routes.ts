import { Router } from 'express';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import { applyRateLimiter } from '../../middleware/rate-limiter.js';
import { validateBody } from '../../middleware/validate-body.js';
import type { ApplyController } from './apply.controller.js';
import { applyBodySchema, updateStatusBodySchema } from './apply.validation.js';

export function createApplyRouter(controller: ApplyController): Router {
  const router = Router();
  // Apply rate limiting: 5 requests per minute per IP
  router.post('/apply', applyRateLimiter, validateBody(applyBodySchema), controller.submit);
  return router;
}

export function createApplyAdminRouter(controller: ApplyController): Router {
  const router = Router();

  // List all applications with optional filtering
  router.get('/applications', requireAdminAuth, controller.list);

  // Export applications to CSV
  router.get('/applications/export', requireAdminAuth, controller.export);

  // Get single application
  router.get('/applications/:id', requireAdminAuth, controller.getById);

  // Update application status
  router.patch(
    '/applications/:id',
    requireAdminAuth,
    validateBody(updateStatusBodySchema),
    controller.updateStatus
  );

  return router;
}
