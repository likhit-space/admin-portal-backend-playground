import { UserRole } from "../persistence";

export interface VerifiedAccessToken {
  userId: string;
  sessionId: string;
  role: UserRole;
  expiresAt: Date;
}

export interface TokenVerifier {
  verify(token: string): VerifiedAccessToken;
}