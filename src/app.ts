import express, { type Express } from 'express';
import { errorMiddleware } from './transport/middlewares/error.middleware';
import { createAuthRoute, createUserRoutes } from './transport';
import { requestIdMiddleware } from './transport/middlewares/request-id.middleware';
import { httpLoggerMiddleware } from './transport/middlewares/http-logger.middleware';

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.use(requestIdMiddleware);
  app.use(httpLoggerMiddleware);

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.use('/api/v1/auth', createAuthRoute());

  app.use('/api/v1/users', createUserRoutes());

  app.use(errorMiddleware);

  return app;
}
