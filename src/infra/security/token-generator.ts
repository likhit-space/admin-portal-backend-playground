export interface AccessTokenResult {
  token: string;
  expiresAt: Date;
}

export interface TokenGenerator {
  generateRefreshToken(): string;
  generateAccessToken(input: { userId: string, sessionId: string }): AccessTokenResult;
}
