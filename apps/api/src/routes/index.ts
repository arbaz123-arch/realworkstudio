import type { Express } from 'express';
import { AdminAuthController } from '../modules/admin/auth/admin.controller.js';
import { AdminAuthRepository } from '../modules/admin/auth/admin.repository.js';
import { AdminAuthService } from '../modules/admin/auth/admin.service.js';
import { createAdminAuthRouter } from '../modules/admin/auth/admin.routes.js';
import { ApplyController } from '../modules/apply/apply.controller.js';
import { ApplyRepository } from '../modules/apply/apply.repository.js';
import { createApplyRouter } from '../modules/apply/apply.routes.js';
import { ApplyService } from '../modules/apply/apply.service.js';
import { ContentController } from '../modules/content/content.controller.js';
import { ContentRepository } from '../modules/content/content.repository.js';
import {
  createContentAdminRouter,
  createContentPublicRouter,
} from '../modules/content/content.routes.js';
import { ContentService } from '../modules/content/content.service.js';
import { DashboardController } from '../modules/dashboard/dashboard.controller.js';
import { DashboardRepository } from '../modules/dashboard/dashboard.repository.js';
import { createDashboardRouter } from '../modules/dashboard/dashboard.routes.js';
import { DashboardService } from '../modules/dashboard/dashboard.service.js';
import { HealthController } from '../modules/health/health.controller.js';
import { HealthRepository } from '../modules/health/health.repository.js';
import { HealthService } from '../modules/health/health.service.js';
import { createHealthRouter } from '../modules/health/health.routes.js';
import { LeaderboardController } from '../modules/leaderboard/leaderboard.controller.js';
import { LeaderboardRepository } from '../modules/leaderboard/leaderboard.repository.js';
import {
  createLeaderboardAdminRouter,
  createLeaderboardPublicRouter,
} from '../modules/leaderboard/leaderboard.routes.js';
import { LeaderboardService } from '../modules/leaderboard/leaderboard.service.js';
import { MediaController } from '../modules/media/media.controller.js';
import { MediaRepository } from '../modules/media/media.repository.js';
import { createMediaAdminRouter } from '../modules/media/media.routes.js';
import { MediaService } from '../modules/media/media.service.js';
import { ProgramsController } from '../modules/programs/programs.controller.js';
import { ProgramsRepository } from '../modules/programs/programs.repository.js';
import {
  createProgramsAdminRouter,
  createProgramsPublicRouter,
} from '../modules/programs/programs.routes.js';
import { ProgramsService } from '../modules/programs/programs.service.js';
import { SeoController } from '../modules/seo/seo.controller.js';
import { SeoRepository } from '../modules/seo/seo.repository.js';
import { createSeoAdminRouter, createSeoPublicRouter } from '../modules/seo/seo.routes.js';
import { SeoService } from '../modules/seo/seo.service.js';
import { TestimonialsController } from '../modules/testimonials/testimonials.controller.js';
import { TestimonialsRepository } from '../modules/testimonials/testimonials.repository.js';
import {
  createTestimonialsAdminRouter,
  createTestimonialsPublicRouter,
} from '../modules/testimonials/testimonials.routes.js';
import { TestimonialsService } from '../modules/testimonials/testimonials.service.js';

export function registerRoutes(app: Express): void {
  const healthRepository = new HealthRepository();
  const healthService = new HealthService(healthRepository);
  const healthController = new HealthController(healthService);

  const adminAuthRepository = new AdminAuthRepository();
  const adminAuthService = new AdminAuthService(adminAuthRepository);
  const adminAuthController = new AdminAuthController(adminAuthService);

  const dashboardRepository = new DashboardRepository();
  const dashboardService = new DashboardService(dashboardRepository);
  const dashboardController = new DashboardController(dashboardService);

  const programsRepository = new ProgramsRepository();
  const programsService = new ProgramsService(programsRepository);
  const programsController = new ProgramsController(programsService);

  const testimonialsRepository = new TestimonialsRepository();
  const testimonialsService = new TestimonialsService(testimonialsRepository);
  const testimonialsController = new TestimonialsController(testimonialsService);

  const leaderboardRepository = new LeaderboardRepository();
  const leaderboardService = new LeaderboardService(leaderboardRepository);
  const leaderboardController = new LeaderboardController(leaderboardService);

  const mediaRepository = new MediaRepository();
  const mediaService = new MediaService(mediaRepository);
  const mediaController = new MediaController(mediaService);

  const contentRepository = new ContentRepository();
  const contentService = new ContentService(contentRepository);
  const contentController = new ContentController(contentService);

  const applyRepository = new ApplyRepository();
  const applyService = new ApplyService(applyRepository, contentRepository);
  const applyController = new ApplyController(applyService);

  const seoRepository = new SeoRepository();
  const seoService = new SeoService(seoRepository);
  const seoController = new SeoController(seoService);

  app.use('/api', createHealthRouter(healthController));
  app.use('/api', createProgramsPublicRouter(programsController));
  app.use('/api', createTestimonialsPublicRouter(testimonialsController));
  app.use('/api', createLeaderboardPublicRouter(leaderboardController));
  app.use('/api', createContentPublicRouter(contentController));
  app.use('/api', createApplyRouter(applyController));
  app.use('/api', createSeoPublicRouter(seoController));

  app.use('/api/admin', createAdminAuthRouter(adminAuthController));
  app.use('/api/admin', createDashboardRouter(dashboardController));
  app.use('/api/admin', createProgramsAdminRouter(programsController));
  app.use('/api/admin', createTestimonialsAdminRouter(testimonialsController));
  app.use('/api/admin', createLeaderboardAdminRouter(leaderboardController));
  app.use('/api/admin', createMediaAdminRouter(mediaController));
  app.use('/api/admin', createContentAdminRouter(contentController));
  app.use('/api/admin', createSeoAdminRouter(seoController));
}
