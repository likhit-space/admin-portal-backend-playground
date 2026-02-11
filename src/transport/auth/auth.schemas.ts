import { z } from 'zod';

const trimmedString = z.string().trim();
const emailSchema = trimmedString
  .min(1, 'Email is required')
  .email('Invalid email format')
  .transform((val) => val.toLowerCase());

const passwordSchema = trimmedString.min(
  8,
  'Password must be at least 8 characters long',
);

export const registerSchema = z.object({
  username: trimmedString.min(1, 'Username is required'),
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterRequest = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginRequest = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: trimmedString.min(1, 'Refresh token is required'),
});

export type RefreshRequest = z.infer<typeof refreshSchema>;