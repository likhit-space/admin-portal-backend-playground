import jwt from 'jsonwebtoken';
import type { TokenVerifier, VerifiedAccessToken } from './token-verifier';
import { UserRole } from '../persistence';

type JwtPayload = {
  userId: string;
  sessionId: string;
  role: UserRole;
  exp: number;
};

export class JwtTokenVerifier implements TokenVerifier {
  private readonly secret = 'dev-secret';
  verify(token: string): VerifiedAccessToken {
    const decoded = jwt.verify(token, this.secret) as JwtPayload;
    return {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      role: decoded.role,
      expiresAt: new Date(decoded.exp * 1000),
    };
  }
}
