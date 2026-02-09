import {
  SessionRepository,
  UserRecord,
  UserRepository,
} from '../../infra/persistence';
import { PasswordHasher, TokenGenerator } from '../../infra/security';
import { Clock } from '../../infra/time';
import { AuthServiceImpl } from './auth-service.impl';

describe('AuthServiceImpl', () => {
  it('should login successfully with valid credentials', async () => {
    //Arrange
    const fakeUserRepo: UserRepository = {
      findByEmail: async (email) => ({
        id: 'user-1',
        username: 'john',
        email,
        passwordHash: 'hashed-password',
        status: 'ACTIVE',
        createAt: new Date(),
      }),
      findById: async () => {
        throw new Error('not used');
      },
      create: async () => {
        throw new Error('not used');
      },
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
});
