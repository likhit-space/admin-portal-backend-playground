import express, { type Express } from 'express';
import { errorMiddleware } from './transport/middlewares/error.middleware';
import { createAuthRoute, createUserRoutes } from './transport';

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.use('/api/v1/auth', createAuthRoute());

  app.use('/api/v1/users', createUserRoutes());

  app.use(errorMiddleware);

  return app;
}
