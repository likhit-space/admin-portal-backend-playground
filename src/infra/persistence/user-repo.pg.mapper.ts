import { UserRecord } from './user-repo';

interface UserRow {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  status: 'ACTIVE' | 'DISABLED' | 'DELETED';
  role: 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
  created_at: Date;
  updated_at: Date;
}

export function mapUserRowToRecord(row: UserRow): UserRecord {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    passwordHash: row.password_hash,
    status: row.status,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
