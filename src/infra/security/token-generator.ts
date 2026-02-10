export interface AccessTokenResult {
  token: string;
  expiresAt: Date;
}

export interface TokenGenerator {
  generateRefreshToken(): string;
  generateAccessToken(payload: { userId: string, sessionId: string }): AccessTokenResult;
}
