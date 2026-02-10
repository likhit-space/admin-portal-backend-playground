import { pgPool } from '../db/pg-pool';
import {
  CreateSessionRecord,
  SessionRecord,
  SessionRepository,
} from './session-repo';
import { mapSessionRowToRecord } from './session-repo.pg.mapper';

export class PgSessionRepository implements SessionRepository {
  async findByRefreshToken(token: string): Promise<SessionRecord | null> {
    const result = await pgPool.query(
      `
      SELECT
        id,
        user_id,
        refresh_token,
        expires_at,
        revoked_at,
        created_at
      FROM sessions
      WHERE refresh_token = $1
      LIMIT 1
      `,
      [token],
    );
    if (result.rowCount === 0) {
      return null;
    }
    return mapSessionRowToRecord(result.rows[0]);
  }
  async create(input: CreateSessionRecord): Promise<SessionRecord> {
    const result = await pgPool.query(
      `
      INSERT INTO sessions (
        id,
        user_id,
        refresh_token,
        expires_at,
        revoked_at,
        created_at
      )
      VALUES (
        gen_random_uuid(),
        $1,
        $2,
        $3,
        NULL,
        NOW()
      )
      RETURNING
        id,
        user_id,
        refresh_token,
        expires_at,
        revoked_at,
        created_at
      `,
      [input.userId, input.refreshToken, input.expiresAt],
    );
    return mapSessionRowToRecord(result.rows[0]);
  }

  async revokeById(sessionId: string): Promise<void> {
    await pgPool.query(
      `
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE id = $1
        AND revoked_at IS NULL
      `,
      [sessionId],
    );
  }
  async revokeAllByUserId(userId: string): Promise<void> {
    await pgPool.query(
      `
      UPDATE sessions
      SET revoked_at = NOW()
      WHERE user_id = $1
        AND revoked_at IS NULL
      `,
      [userId],
    );
  }
}
