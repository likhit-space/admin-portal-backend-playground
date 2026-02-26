import express, { type Express } from 'express';
import { createAuthRoute, createUserRoutes } from './transport';
import { ConsoleLogger } from './infra/logger';
import {
  createHttpLoggerMiddleware,
  errorMiddleware,
  requestIdMiddleware,
} from './transport/middlewares';

export function createApp(): Express {
  const app = express();

  const logger = new ConsoleLogger();

  app.use(express.json());

  app.use(requestIdMiddleware);
  app.use(createHttpLoggerMiddleware(logger));

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

  app.use('/api/v1/auth', createAuthRoute(logger));

  app.use('/api/v1/users', createUserRoutes(logger));

  app.use(errorMiddleware);

  return app;
}
