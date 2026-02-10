import { UserRecord } from './user-repo';

interface UserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  status: 'ACTIVE' | 'DISABLED' | 'DELETED';
  created_at: Date;
}

export function mapUserRowToRecord(row: UserRow): UserRecord {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    status: row.status,
    createdAt: row.created_at,
  };
}
