export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  status: 'ACTIVE' | 'DISABLED' | 'DELETED';
  createAt: Date;
}

export interface CreateUserRecord {
  username: string;
  email: string;
  passwordHash: string;
  status: 'ACTIVE';
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  create(input: CreateUserRecord): Promise<UserRecord>;
}
