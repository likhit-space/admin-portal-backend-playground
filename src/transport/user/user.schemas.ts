import { z } from 'zod';

export const userIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type UserIdRequest = z.infer<typeof userIdParamSchema>;

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1),
  limit: z.coerce.number().int().min(1).max(100),
  status: z.enum(['ACTIVE', 'DISABLED', 'DELETED']).optional(),
});

export type ListUsersRequest = z.infer<typeof listUsersQuerySchema>;

export const updateUserStatusSchema = z.object({
  newStatus: z.enum(['ACTIVE', 'DISABLED', 'DELETED']),
});

export type UpdateUserRequest = z.infer<typeof updateUserStatusSchema>;
