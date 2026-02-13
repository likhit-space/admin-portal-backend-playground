import jwt from 'jsonwebtoken';
import type { TokenVerifier, VerifiedAccessToken } from './token-verifier';

type JwtPayload = {
  userId: string;
  sessionId: string;
  exp: number;
};

export class JwtTokenVerifier implements TokenVerifier {
  private readonly secret = 'dev-secret';
  verify(token: string): VerifiedAccessToken {
    const decoded = jwt.verify(token, this.secret) as JwtPayload;
    return {
      userId: decoded.userId,
      sessionId: decoded.sessionId,
      expiresAt: new Date(decoded.exp * 1000),
    };
  }
}
