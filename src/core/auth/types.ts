export type UserStatus = 'ACTIVE' | 'DISABLED' | 'DELETED';
export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  role: Role;
}

/**
 * Token pair returned after successful authentication
 * Business does not care how tokens are generated.
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date; // unix timestamp (ms or sec, choose one rule)
}

/**
 * Final business outcome of auth flows
 */
export interface AuthResult {
  user: AuthUser;
  token: AuthToken;
}

/* =========================
 * Use case inputs
 * ========================= */

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshInput {
  refreshToken: string;
}
