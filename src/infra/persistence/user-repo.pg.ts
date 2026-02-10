import { pgPool } from '../db/pg-pool';
import { CreateUserRecord, UserRecord, UserRepository } from './user-repo';
import { mapUserRowToRecord } from './user-repo.pg.mapper';

export class PgUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await pgPool.query(
      `
      SELECT id, username, email, password_hash, status, created_at
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email],
    );
    if (result.rowCount === 0) {
      return null;
    }
    return mapUserRowToRecord(result.rows[0]);
  }
  async findById(id: string): Promise<UserRecord | null> {
    const result = await pgPool.query(
      `
      SELECT id, username, email, password_hash, status, created_at
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [id],
    );
    if (result.rowCount === 0) {
      return null;
    }

    return mapUserRowToRecord(result.rows[0]);
  }
  async create(input: CreateUserRecord): Promise<UserRecord> {
    const result = await pgPool.query(
      `
      INSERT INTO users (username, email, password_hash, status)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, password_hash, status, created_at
      `,
      [input.username, input.email, input.passwordHash, input.status],
    );
    return mapUserRowToRecord(result.rows[0]);
  }
}
