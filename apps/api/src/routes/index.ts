import type { Express } from 'express';
import { AdminAuthController } from '../modules/admin/auth/admin.controller.js';
import { AdminAuthRepository } from '../modules/admin/auth/admin.repository.js';
import { AdminAuthService } from '../modules/admin/auth/admin.service.js';
import { createAdminAuthRouter } from '../modules/admin/auth/admin.routes.js';
import { HealthController } from '../modules/health/health.controller.js';
import { HealthRepository } from '../modules/health/health.repository.js';
import { HealthService } from '../modules/health/health.service.js';
import { createHealthRouter } from '../modules/health/health.routes.js';

export function registerRoutes(app: Express): void {
  const healthRepository = new HealthRepository();
  const healthService = new HealthService(healthRepository);
  const healthController = new HealthController(healthService);

  const adminAuthRepository = new AdminAuthRepository();
  const adminAuthService = new AdminAuthService(adminAuthRepository);
  const adminAuthController = new AdminAuthController(adminAuthService);

  app.use('/api', createHealthRouter(healthController));
  app.use('/api/admin', createAdminAuthRouter(adminAuthController));
}
