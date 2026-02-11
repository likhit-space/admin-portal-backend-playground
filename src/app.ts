import express, { type Express } from 'express';
import { createAuthRoute } from './transport/auth/auth.routes';
import { errorMiddleware } from './transport/middlewares/error.middleware';

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.use('/api/v1/auth', createAuthRoute());

  app.use(errorMiddleware);

  return app;
}
