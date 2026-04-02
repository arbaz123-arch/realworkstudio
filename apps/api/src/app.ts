import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { registerRoutes } from './routes/index.js';

export function createApp(): express.Express {
  const app = express();

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
