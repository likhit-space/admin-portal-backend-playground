import jwt from 'jsonwebtoken';
import { AccessTokenResult, TokenGenerator } from './token-generator';

export class JwtTokenGenerator implements TokenGenerator {
  private readonly secret = 'dev-secret';
  private readonly accessTokenTTLSeconds = 15 * 60; // 15mins

  generateRefreshToken(): string {
    return crypto.randomUUID();
  }
  generateAccessToken(payload: {
    userId: string;
    sessionId: string;
  }): AccessTokenResult {
    const expiresAt = new Date(Date.now() + this.accessTokenTTLSeconds * 1000);
    const token = jwt.sign(payload, this.secret, {
      expiresIn: this.accessTokenTTLSeconds,
    });
    return { token, expiresAt };
  }
}
