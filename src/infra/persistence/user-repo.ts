export type UserStatus = 'ACTIVE' | 'DISABLED' | 'DELETED';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRecord {
  username: string;
  email: string;
  passwordHash: string;
  status: 'ACTIVE';
  role: 'STAFF';
}

export interface FindManyUsersParams {
  offset: number;
  limit: number;
  status?: UserStatus;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  findById(id: string): Promise<UserRecord | null>;
  create(input: CreateUserRecord): Promise<UserRecord>;

  findMany(params: FindManyUsersParams): Promise<UserRecord[]>;
  countAll(status?: UserStatus): Promise<number>;
  updateStatus(id: string, status: UserStatus): Promise<UserRecord>;
}
