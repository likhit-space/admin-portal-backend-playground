import { SessionRepository, UserRepository } from '../../infra/persistence';
import { PasswordHasher, TokenGenerator } from '../../infra/security';
import { Clock } from '../../infra/time';
import {
  EmailAlreadyExistsError,
  RefreshTokenExpiredError,
  UserNotFoundError,
} from './auth-errors';
import { AuthServiceImpl } from './auth-service.impl';

describe('AuthServiceImpl', () => {
  it('should register user and issue auth result successfully', async () => {
    // Arrange

    const fakeUserRepo: UserRepository = {
      findByEmail: async () => null, // email not exists
      findById: async () => {
        throw new Error('not used');
      },
      create: async (input) => ({
        id: 'user-1',
        username: input.username,
        email: input.email,
        passwordHash: input.passwordHash,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      countAll: async () => {
        throw new Error('not used');
      },
      updateStatus: async () => {
        throw new Error('not used');
      },
      findMany: async()=> {
        throw new Error('not used');
      }
    };

    const fakeSessionRepo: SessionRepository = {
      findByRefreshToken: async () => null,
      create: async (input) => ({
        id: 'session-1',
        userId: input.userId,
        refreshToken: input.refreshToken,
        expiresAt: input.expiresAt,
        revokedAt: null,
        createdAt: new Date(),
      }),
      revokeById: async () => {},
      revokeAllByUserId: async () => {},
    };

    const fakePasswordHasher: PasswordHasher = {
      hash: async () => 'hashed-password',
      compare: async () => {
        throw new Error('not used');
      },
    };

    const fakeTokenGenerator: TokenGenerator = {
      generateRefreshToken: () => 'refresh-token-123',
      generateAccessToken: () => ({
        token: 'access-token-abc',
        expiresAt: new Date('2030-01-01T00:00:00Z'),
      }),
    };

    const fakeClock: Clock = {
      now: () => new Date('2025-01-01T00:00:00Z'),
    };

    const authService = new AuthServiceImpl(
      fakeUserRepo,
      fakeSessionRepo,
      fakePasswordHasher,
      fakeTokenGenerator,
      fakeClock,
    );

    // Act
    const result = await authService.register({
      username: 'john',
      email: 'john@example.com',
      password: 'plain-password',
    });

    // Assert
    expect(result.user).toEqual({
      id: 'user-1',
      username: 'john',
      email: 'john@example.com',
      status: 'ACTIVE',
    });

    expect(result.token.accessToken).toBe('access-token-abc');
    expect(result.token.refreshToken).toBe('refresh-token-123');
    expect(result.token.expiresAt).toEqual(new Date('2030-01-01T00:00:00Z'));
  });
  it('should throw EmailAlreadyExistsError when email already exists', async () => {
    // Arrange
    const fakeUserRepo: UserRepository = {
      findByEmail: async () => ({
        id: 'existing-user',
        username: 'exist',
        email: 'exist@example.com',
        passwordHash: 'hashed',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      findById: async () => {
        throw new Error('not used');
      },
      create: async () => {
        throw new Error('should not be called');
      },
      countAll: async () => {
        throw new Error('not used');
      },
      updateStatus: async () => {
        throw new Error('not used');
      },
      findMany: async()=> {
        throw new Error('not used');
      }
    };
    const authService = new AuthServiceImpl(
      fakeUserRepo,
      {} as SessionRepository,
      {} as PasswordHasher,
      {} as TokenGenerator,
      { now: () => new Date() },
    );

    await expect(
      authService.register({
        username: 'john',
        email: 'exist@example.com',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });

  it('should login successfully with valid credentials', async () => {
    //Arrange
    const fakeUserRepo: UserRepository = {
      findByEmail: async (email) => ({
        id: 'user-1',
        username: 'john',
        email,
        passwordHash: 'hashed-password',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      findById: async () => {
        throw new Error('not used');
      },
      create: async () => {
        throw new Error('not used');
      },
      countAll: async () => {
        throw new Error('not used');
      },
      updateStatus: async () => {
        throw new Error('not used');
      },
      findMany: async()=> {
        throw new Error('not used');
      }
    };

    const fakeSessionRepo: SessionRepository = {
      findByRefreshToken: async () => null,
      create: async (input) => ({
        id: 'session-1',
        userId: input.userId,
        refreshToken: input.refreshToken,
        expiresAt: input.expiresAt,
        revokedAt: null,
        createdAt: new Date(),
      }),
      revokeById: async () => {},
      revokeAllByUserId: async () => {},
    };

    const fakePasswordHasher: PasswordHasher = {
      hash: async () => {
        throw new Error('not used');
      },
      compare: async () => true, // password is valid
    };

    const fakeTokenGenerator: TokenGenerator = {
      generateRefreshToken: () => 'refresh-token-123',
      generateAccessToken: () => ({
        token: 'access-token-abc',
        expiresAt: new Date('2030-01-01T00:00:00Z'),
      }),
    };

    const fakeClock: Clock = {
      now: () => new Date('2025-01-01T00:00:00Z'),
    };

    const authService = new AuthServiceImpl(
      fakeUserRepo,
      fakeSessionRepo,
      fakePasswordHasher,
      fakeTokenGenerator,
      fakeClock,
    );

    // Act
    const result = await authService.login({
      email: 'john@example.com',
      password: 'plain-password',
    });

    // Assert

    expect(result.user).toEqual({
      id: 'user-1',
      username: 'john',
      email: 'john@example.com',
      status: 'ACTIVE',
    });

    expect(result.token).toEqual({
      accessToken: 'access-token-abc',
      refreshToken: 'refresh-token-123',
      expiresAt: new Date('2030-01-01T00:00:00Z'),
    });
  });
  it('should throw UserNotFoundError when user does not exist', async () => {
    // Arrange
    const fakeUserRepo: UserRepository = {
      findByEmail: async () => null,
      findById: async () => {
        throw new Error('not used');
      },
      create: async () => {
        throw new Error('not used');
      },
      countAll: async () => {
        throw new Error('not used');
      },
      updateStatus: async () => {
        throw new Error('not used');
      },
      findMany: async()=> {
        throw new Error('not used');
      }
    };

    const authService = new AuthServiceImpl(
      fakeUserRepo,
      {} as SessionRepository,
      {} as PasswordHasher,
      {} as TokenGenerator,
      { now: () => new Date() },
    );

    // Act + Assert
    await expect(
      authService.login({
        email: 'notfound@example.com',
        password: 'any-password',
      }),
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('should refresh session and issue new auth result successfully', async () => {
    // Arrange
    const now = new Date('2025-01-01T00:00:00Z');
    const fakeUserRepo: UserRepository = {
      findByEmail: async () => {
        throw new Error('not used');
      },
      findById: async () => ({
        id: 'user-1',
        username: 'john',
        email: 'john@example.com',
        passwordHash: 'hashed',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      create: async () => {
        throw new Error('not used');
      },
      countAll: async () => {
        throw new Error('not used');
      },
      updateStatus: async () => {
        throw new Error('not used');
      },
      findMany: async()=> {
        throw new Error('not used');
      }
    };

    const fakeSessionRepo: SessionRepository = {
      findByRefreshToken: async () => ({
        id: 'session-old',
        userId: 'user-1',
        refreshToken: 'refresh-old',
        expiresAt: new Date('2025-02-01T00:00:00Z'), // ยังไม่หมดอายุ
        revokedAt: null,
        createdAt: new Date(),
      }),
      create: async (input) => ({
        id: 'session-new',
        userId: input.userId,
        refreshToken: input.refreshToken,
        expiresAt: input.expiresAt,
        revokedAt: null,
        createdAt: new Date(),
      }),
      revokeById: async () => {},
      revokeAllByUserId: async () => {},
    };

    const fakePasswordHasher: PasswordHasher = {
      hash: async () => {
        throw new Error('not used');
      },
      compare: async () => {
        throw new Error('not used');
      },
    };

    const fakeTokenGenerator: TokenGenerator = {
      generateRefreshToken: () => 'refresh-new',
      generateAccessToken: () => ({
        token: 'access-new',
        expiresAt: new Date('2030-01-01T00:00:00Z'),
      }),
    };

    const fakeClock: Clock = {
      now: () => now,
    };

    const authService = new AuthServiceImpl(
      fakeUserRepo,
      fakeSessionRepo,
      fakePasswordHasher,
      fakeTokenGenerator,
      fakeClock,
    );

    // Act
    const result = await authService.refresh({
      refreshToken: 'refresh-old',
    });

    // Assert
    expect(result.user).toEqual({
      id: 'user-1',
      username: 'john',
      email: 'john@example.com',
      status: 'ACTIVE',
    });

    expect(result.token).toEqual({
      accessToken: 'access-new',
      refreshToken: 'refresh-new',
      expiresAt: new Date('2030-01-01T00:00:00Z'),
    });
  });

  it('should throw RefreshTokenExpiredError when refresh token is expired', async () => {
    // Arrange
    const now = new Date('2025-02-01T00:00:00Z');
    const fakeSessionRepo: SessionRepository = {
      findByRefreshToken: async () => ({
        id: 'session-expired',
        userId: 'user-1',
        refreshToken: 'refresh-expired',
        expiresAt: new Date('2025-01-01T00:00:00Z'), // หมดอายุ
        revokedAt: null,
        createdAt: new Date(),
      }),
      create: async () => {
        throw new Error('should not be called');
      },
      revokeById: async () => {
        throw new Error('should not be called');
      },
      revokeAllByUserId: async () => {},
    };

    const authService = new AuthServiceImpl(
      {} as UserRepository,
      fakeSessionRepo,
      {} as PasswordHasher,
      {} as TokenGenerator,
      { now: () => now },
    );

    // Act + Assert
    await expect(
      authService.refresh({
        refreshToken: 'refresh-expired',
      }),
    ).rejects.toBeInstanceOf(RefreshTokenExpiredError);
  });
});
