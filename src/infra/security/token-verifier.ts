export interface VerifiedAccessToken {
  userId: string;
  sessionId: string;
  expiresAt: Date;
}

export interface TokenVerifier {
  verify(token: string): VerifiedAccessToken;
}