import { SessionRecord } from './session-repo';

interface SessionRow {
  id: string;
  user_id: string;
  refresh_token: string;
  expires_at: Date;
  revoked_at: Date | null;
  created_at: Date;
}

export function mapSessionRowToRecord(row: SessionRow): SessionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    refreshToken: row.refresh_token,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
    createdAt: row.created_at,
  };
}
