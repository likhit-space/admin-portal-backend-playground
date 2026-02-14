export type UserStatus = 'ACTIVE' | 'DISABLED' | 'DELETED';
export interface UserRecord {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRecord {
  username: string;
  email: string;
  passwordHash: string;
  status: 'ACTIVE';
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
