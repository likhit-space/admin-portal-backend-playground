import { UserRole } from '../../domain/user';

export interface AccessTokenResult {
  token: string;
  expiresAt: Date;
}

export interface TokenGenerator {
  generateRefreshToken(): string;
  generateAccessToken(payload: {
    userId: string;
    sessionId: string;
    role: UserRole;
  }): AccessTokenResult;
}
