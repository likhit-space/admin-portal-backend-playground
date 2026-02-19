import { Router } from 'express';
import { PgUserRepository } from '../../infra/persistence/user-repo.pg';
import { PgSessionRepository } from '../../infra/persistence/session-repo.pg';
import { BcryptPasswordHasher, JwtTokenGenerator } from '../../infra/security';
import { SystemClock } from '../../infra/time/system-clock';
import { AuthServiceImpl } from '../../core/auth/auth-service.impl';
import { createAuthController } from './auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, refreshSchema, registerSchema } from './auth.schemas';
import { Logger } from '../../infra/logger';

export function createAuthRoute(logger: Logger) {
  const router = Router();

  const userRepo = new PgUserRepository();
  const sessionRepo = new PgSessionRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const tokenGenerator = new JwtTokenGenerator();
  const clock = new SystemClock();

  // Business Core
  const authService = new AuthServiceImpl(
    userRepo,
    sessionRepo,
    passwordHasher,
    tokenGenerator,
    clock,
  );

  // Controller
  const authController = createAuthController(authService);

  // Routes
  router.post(
    '/register',
    validate({ body: registerSchema }),
    authController.register,
  );
  router.post('/login', validate({ body: loginSchema }), authController.login);
  router.post(
    '/refresh',
    validate({ body: refreshSchema }),
    authController.refresh,
  );

  return router;
}
