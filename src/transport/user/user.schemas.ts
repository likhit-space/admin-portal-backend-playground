import { z } from 'zod';
import { USER_STATUSES } from '../../domain/user';

export const userIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type UserIdRequest = z.infer<typeof userIdParamSchema>;

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1).max(100),
  status: z.enum(USER_STATUSES).optional(),
});

export type ListUsersRequest = z.infer<typeof listUsersQuerySchema>;

export const updateUserStatusSchema = z.object({
  newStatus: z.enum(USER_STATUSES),
});

export type UpdateUserRequest = z.infer<typeof updateUserStatusSchema>;

export const changeUserRoleSchema = z.object({
  newRole: z.enum(['ADMIN', 'STAFF']),
});

export type ChangeUserRoleRequest = z.infer<typeof changeUserRoleSchema>;
