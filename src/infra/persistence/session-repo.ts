export interface SessionRecord {
  id: string;
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export interface CreateSessionRecord {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface SessionRepository {
  findByRefreshToken(token: string): Promise<SessionRecord | null>;
  create(input: CreateSessionRecord): Promise<SessionRecord>;
  revokeById(sessionId: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}
