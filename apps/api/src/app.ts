import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { registerRoutes } from './routes/index.js';

export function createApp(): express.Express {
  const app = express();

  // Request logging middleware
  app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.path} - from ${req.headers.referer || 'direct'}`);
    next();
  });

  app.use(helmet());
  app.use(
    cors({
      origin: [env.adminOrigin, env.webOrigin],
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));

  registerRoutes(app);

  app.use(errorHandler);

  return app;
}
