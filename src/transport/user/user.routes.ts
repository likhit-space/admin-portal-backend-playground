import { Router } from 'express';
import { PgUserRepository } from '../../infra/persistence';
import { UserServiceImpl } from '../../core/user/user-service.impl';
import { createUserController } from './user.controller';
import { authenticate } from '../middlewares/authenticate.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  changeUserRoleSchema,
  listUsersQuerySchema,
  updateUserStatusSchema,
  userIdParamSchema,
} from './user.schemas';
import { JwtTokenVerifier } from '../../infra/security';
import { Logger } from '../../infra/logger';

export function createUserRoutes(logger: Logger) {
  const router = Router();

  const userRepo = new PgUserRepository();
  const userService = new UserServiceImpl(userRepo, logger);
  const controller = createUserController(userService);

  const tokenVerifier = new JwtTokenVerifier();
  const authMiddleware = authenticate(tokenVerifier);

  router.use(authMiddleware);

  // GET /users/me
  router.get('/me', controller.getCurrentUser);

  // GET /users
  router.get(
    '/',
    validate({ query: listUsersQuerySchema }),
    controller.listUsers,
  );

  // GET /users/:id
  router.get(
    '/:id',
    validate({ params: userIdParamSchema }),
    controller.getUserById,
  );

  // PATCH /users/:id/status
  router.patch(
    '/:id/status',
    validate({ params: userIdParamSchema, body: updateUserStatusSchema }),
    controller.updateUserStatus,
  );

  // PATCH /users/:id/role
  router.patch(
    '/:id/role',
    validate({ params: userIdParamSchema, body: changeUserRoleSchema }),
    controller.changeUserRole,
  );

  return router;
}
