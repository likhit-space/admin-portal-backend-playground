import { UserRecord, UserRepository } from '../../infra/persistence';
import { InvalidUserStatusTransitionError, UserNotFound } from './user-errors';
import { UserServiceImpl } from './user-service.impl';

describe('UserServiceImpl', () => {
  let mockRepo: jest.Mocked<UserRepository>;
  let service: UserServiceImpl;

  const baseUser: UserRecord = {
    id: 'u1',
    username: 'john',
    email: 'john@test.com',
    passwordHash: 'hashed',
    status: 'ACTIVE',
    role: 'STAFF',
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
    };
    service = new UserServiceImpl(mockRepo);
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

      const result = await service.updateUserStatus({
        userId: 'u1',
        newStatus: 'DISABLED',
      });

      expect(result.user.status).toBe('DISABLED');
      expect(mockRepo.updateStatus).toHaveBeenCalledWith('u1', 'DISABLED');
    });
    it('should throw InvalidUserStatusTransitionError on invalid transition', async () => {
      mockRepo.findById.mockResolvedValue({
        ...baseUser,
        status: 'DELETED',
      });
      await expect(
        service.updateUserStatus({
          userId: 'u1',
          newStatus: 'ACTIVE',
        }),
      ).rejects.toBeInstanceOf(InvalidUserStatusTransitionError);
    });
  });
});
