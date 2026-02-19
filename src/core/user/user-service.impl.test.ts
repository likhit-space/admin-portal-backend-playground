import { ExecutionContext } from '../../domain/common/execution-context';
import { Logger } from '../../infra/logger';
import { UserRecord, UserRepository } from '../../infra/persistence';
import { ForbiddenError, UserNotFound } from './user-errors';
import { UserServiceImpl } from './user-service.impl';

describe('UserServiceImpl', () => {
  let mockRepo: jest.Mocked<UserRepository>;
  let service: UserServiceImpl;
  let mockLogger: jest.Mocked<Logger>;
  let mockContext: ExecutionContext;

  const baseUser: UserRecord = {
    id: 'u1',
    username: 'john',
    email: 'john@test.com',
    passwordHash: 'hashed',
    status: 'ACTIVE' as const,
    role: 'STAFF' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      countAll: jest.fn(),
      updateStatus: jest.fn(),
      updateRole: jest.fn(),
      countByRole: jest.fn(),
    };
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    service = new UserServiceImpl(mockRepo, mockLogger);
    mockContext = { requestId: '123' };
  });

  // getCurrentUser
  describe('getCurrentUser', () => {
    it('should return user when found', async () => {
      mockRepo.findById.mockResolvedValue(baseUser);
      const result = await service.getCurrentUser({ userId: 'u1' });
      expect(result.user.id).toBe('u1');
      expect(mockRepo.findById).toHaveBeenCalledWith('u1');
    });
    it('should throw UserNotFoundError when user not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        service.getCurrentUser({ userId: 'u1' }),
      ).rejects.toBeInstanceOf(UserNotFound);
    });
  });

  // getUserById
  describe('getUserById', () => {
    it('should return user when found', async () => {
      mockRepo.findById.mockResolvedValue(baseUser);

      const result = await service.getUserById({ userId: 'u1' });

      expect(result.user.email).toBe('john@test.com');
      expect(mockRepo.findById).toHaveBeenCalledWith('u1');
    });

    it('should throw UserNotFoundError when user not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        service.getUserById({ userId: 'u1' }),
      ).rejects.toBeInstanceOf(UserNotFound);
    });
  });

  // listUsers
  describe('listUsers', () => {
    it('should return paginated users', async () => {
      mockRepo.findMany.mockResolvedValue([baseUser]);
      mockRepo.countAll.mockResolvedValue(1);

      const result = await service.listUsers({
        page: 1,
        limit: 10,
      });

      expect(result.users).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(mockRepo.findMany).toHaveBeenCalledWith({
        offset: 0,
        limit: 10,
      });
    });
  });

  // updateUserStatus
  describe('updateUserStatus', () => {
    it('should update status when transition is valid', async () => {
      mockRepo.findById.mockResolvedValue(baseUser);
      mockRepo.updateStatus.mockResolvedValue({
        ...baseUser,
        status: 'DISABLED',
      });

      const actor = {
        userId: 'admin-1',
        role: 'ADMIN' as const,
      };

      const result = await service.updateUserStatus(
        {
          userId: 'u1',
          newStatus: 'DISABLED',
        },
        actor,
        mockContext,
      );

      expect(result.user.status).toBe('DISABLED');
      expect(mockRepo.updateStatus).toHaveBeenCalled();
    });
    it('should throw InvalidUserStatusTransitionError on invalid transition', async () => {
      mockRepo.findById.mockResolvedValue({
        ...baseUser,
        status: 'DELETED',
      });

      const actor = {
        userId: 'staff-1',
        role: 'STAFF' as const,
      };

      await expect(
        service.updateUserStatus(
          {
            userId: 'u1',
            newStatus: 'ACTIVE',
          },
          actor,
          mockContext,
        ),
      ).rejects.toBeInstanceOf(ForbiddenError);
      expect(mockRepo.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('changeUserRole', () => {
    const superAdminActor = {
      userId: 'super-1',
      role: 'SUPER_ADMIN' as const,
    };
    const staffActor = {
      userId: 'staff-1',
      role: 'STAFF' as const,
    };

    it('should update role successfully when actor is SUPER_ADMIN', async () => {
      mockRepo.findById.mockResolvedValue(baseUser);
      mockRepo.updateRole.mockResolvedValue({
        ...baseUser,
        role: 'ADMIN',
      });

      const result = await service.changeUserRole(
        { userId: 'u1', newRole: 'ADMIN' },
        superAdminActor,
        mockContext,
      );
      expect(mockRepo.updateRole).toHaveBeenCalledWith('u1', 'ADMIN');
      expect(result.user.role).toBe('ADMIN');
    });

    it('should throw ForbiddenError when actor is not SUPER_ADMIN', async () => {
      mockRepo.findById.mockResolvedValue(baseUser);

      await expect(
        service.changeUserRole(
          { userId: 'u1', newRole: 'ADMIN' },
          staffActor,
          mockContext,
        ),
      ).rejects.toBeInstanceOf(ForbiddenError);
      expect(mockRepo.updateRole).not.toHaveBeenCalled();
    });
  });
});
