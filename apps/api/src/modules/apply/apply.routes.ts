import { Router } from 'express';
import { validateBody } from '../../middleware/validate-body.js';
import type { ApplyController } from './apply.controller.js';
import { applyBodySchema } from './apply.validation.js';

export function createApplyRouter(controller: ApplyController): Router {
  const router = Router();
  router.post('/apply', validateBody(applyBodySchema), controller.submit);
  return router;
}
