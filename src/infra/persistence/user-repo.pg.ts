import { pgPool } from '../db/pg-pool';
import {
  CreateUserRecord,
  FindManyUsersParams,
  UserRecord,
  UserRepository,
  UserStatus,
} from './user-repo';
import { mapUserRowToRecord } from './user-repo.pg.mapper';

export class PgUserRepository implements UserRepository {
  async findMany(params: FindManyUsersParams): Promise<UserRecord[]> {
    const values: unknown[] = [];
    const conditions: string[] = [];

    if (params.status) {
      values.push(params.status);
      conditions.push(`status = $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    values.push(params.limit);
    values.push(params.offset);

    const query = `
      SELECT id, username, email, password_hash, status, role, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `;

    const result = await pgPool.query(query, values);
    return result.rows.map(mapUserRowToRecord);
  }

  async countAll(status?: UserStatus): Promise<number> {
    if (!status) {
      const result = await pgPool.query(`SELECT COUNT(*) FROM users`);
      return Number(result.rows[0].count);
    }

    const result = await pgPool.query(
      `
      SELECT COUNT(*)
      FROM users
      WHERE status = $1
      `,
      [status],
    );

    return Number(result.rows[0].count);
  }

  async updateStatus(id: string, status: UserStatus): Promise<UserRecord> {
    const result = await pgPool.query(
      `
      UPDATE users
      SET status = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, email, password_hash, status, role, created_at, updated_at
      `,
      [status, id],
    );
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }

    return mapUserRowToRecord(result.rows[0]);
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await pgPool.query(
      `
      SELECT id, username, email, password_hash, status, role, created_at, updated_at
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
      SELECT id, username, email, password_hash, status, role, created_at, updated_at
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
      INSERT INTO users (username, email, password_hash, status, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, password_hash, status, role, created_at, updated_at
      `,
      [
        input.username,
        input.email,
        input.passwordHash,
        input.status,
        input.role,
      ],
    );
    return mapUserRowToRecord(result.rows[0]);
  }
}
