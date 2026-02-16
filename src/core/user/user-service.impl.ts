import { UserIdentity, UserStatus } from '../../domain/user';
import { UserRecord, UserRepository } from '../../infra/persistence';
import {
  ChangeUserRoleInput,
  ChangeUserRoleOutput,
  GetCurrentUserInput,
  GetCurrentUserOutput,
  GetUserByIdInput,
  GetUserByIdOutput,
  ListUsersInput,
  ListUsersOutput,
  UpdateUserStatusInput,
  UpdateUserStatusOutput,
  User,
} from './types';
import {
  CannotDemoteLastSuperAdminError,
  ForbiddenError,
  InvalidUserStatusTransitionError,
  UserNotFound,
} from './user-errors';
import { UserService } from './user-service';

export class UserServiceImpl implements UserService {
  constructor(private readonly userRepo: UserRepository) {}
  async changeUserRole(
    input: ChangeUserRoleInput,
    actor: UserIdentity,
  ): Promise<ChangeUserRoleOutput> {
    if (actor.role !== 'SUPER_ADMIN') {
      throw new ForbiddenError();
    }

    const target = await this.loadOrThrow(input.userId);

    if (target.role === input.newRole) {
      return { user: this.toEntity(target) };
    }

    if (target.role === 'SUPER_ADMIN') {
      const count = await this.userRepo.countByRole('SUPER_ADMIN');
      if (count <= 1) {
        throw new CannotDemoteLastSuperAdminError();
      }
    }

    const updated = await this.userRepo.updateRole(target.id, input.newRole);
    return { user: this.toEntity(updated) };
  }

  async getCurrentUser(
    input: GetCurrentUserInput,
  ): Promise<GetCurrentUserOutput> {
    const record = await this.loadOrThrow(input.userId);
    return { user: this.toEntity(record) };
  }

  async getUserById(input: GetUserByIdInput): Promise<GetUserByIdOutput> {
    const record = await this.loadOrThrow(input.userId);
    return { user: this.toEntity(record) };
  }

  async listUsers(input: ListUsersInput): Promise<ListUsersOutput> {
    const offset = (input.page - 1) * input.limit;
    const findParams = {
      offset,
      limit: input.limit,
      ...(input.status !== undefined && { status: input.status }),
    };

    const [records, total] = await Promise.all([
      this.userRepo.findMany(findParams),
      this.userRepo.countAll(input.status),
    ]);

    return {
      users: records.map((r) => this.toEntity(r)),
      total,
      page: input.page,
      limit: input.limit,
    };
  }
  async updateUserStatus(
    input: UpdateUserStatusInput,
    actor: UserIdentity,
  ): Promise<UpdateUserStatusOutput> {
    if (actor.role !== 'ADMIN' && actor.role !== 'SUPER_ADMIN') {
      throw new ForbiddenError();
    }
    const existing = await this.loadOrThrow(input.userId);
    if (!this.canTransition(existing.status, input.newStatus)) {
      throw new InvalidUserStatusTransitionError();
    }

    const updated = await this.userRepo.updateStatus(
      input.userId,
      input.newStatus,
    );
    return { user: this.toEntity(updated) };
  }

  private async loadOrThrow(userId: string): Promise<UserRecord> {
    const record = await this.userRepo.findById(userId);
    if (!record) {
      throw new UserNotFound();
    }
    return record;
  }

  private canTransition(current: UserStatus, next: UserStatus) {
    if (current === next) return true;

    const allowedTransition: Record<UserStatus, UserStatus[]> = {
      ACTIVE: ['DISABLED', 'DELETED'],
      DISABLED: ['ACTIVE'],
      DELETED: [],
    };

    return allowedTransition[current].includes(next);
  }

  private toEntity(record: UserRecord): User {
    return {
      id: record.id,
      username: record.username,
      email: record.email,
      status: record.status,
      role: record.role,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
