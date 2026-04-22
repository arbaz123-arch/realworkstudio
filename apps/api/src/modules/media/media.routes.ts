import { Router } from 'express';
import multer from 'multer';
import { requireAdminAuth } from '../../middleware/require-admin-auth.js';
import type { MediaController } from './media.controller.js';

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

export function createMediaAdminRouter(controller: MediaController): Router {
  const router = Router();

  // Upload endpoint with multipart/form-data
  router.post(
    '/media/upload',
    requireAdminAuth,
    upload.single('file'),
    controller.upload
  );

  // List all media
  router.get('/media', requireAdminAuth, controller.list);

  return router;
}
