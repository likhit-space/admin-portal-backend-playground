import {
  SessionRecord,
  SessionRepository,
  UserRecord,
  UserRepository,
} from '../../infra/persistence';
import { PasswordHasher, TokenGenerator } from '../../infra/security';
import { Clock } from '../../infra/time';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  InvalidRefreshTokenError,
  RefreshTokenExpiredError,
  UserDeletedError,
  UserDisabledError,
  UserNotFoundError,
} from './auth-errors';
import { AuthService } from './auth-service';
import {
  RegisterInput,
  LoginInput,
  RefreshInput,
  AuthResult,
  AuthUser,
  UserStatus,
} from './types';

export class AuthServiceImpl implements AuthService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly sessionRepo: SessionRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
    private readonly clock: Clock,
  ) {}
  async register(input: RegisterInput): Promise<AuthResult> {
    const existsUser = await this.userRepo.findByEmail(input.email);
    if (existsUser) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.userRepo.create({
      username: input.username,
      email: input.email,
      passwordHash,
      status: 'ACTIVE',
    });

    const sessionContext = await this.createSessionForUser(user.id);
    return this.buildAuthResult(user, sessionContext);
  }
  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new UserNotFoundError();
    }

    this.assertUserActive(user.status);

    const passwordValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new InvalidCredentialsError();
    }

    const sessionContext = await this.createSessionForUser(user.id);

    return this.buildAuthResult(user, sessionContext);
  }

  async refresh(input: RefreshInput): Promise<AuthResult> {
    const session = await this.sessionRepo.findByRefreshToken(
      input.refreshToken,
    );
    if (!session) {
      throw new InvalidRefreshTokenError();
    }

    const now = this.clock.now();

    if (session.expiresAt <= now) {
      throw new RefreshTokenExpiredError();
    }
    if (session.revokedAt) {
      throw new InvalidRefreshTokenError();
    }

    const user = await this.userRepo.findById(session.userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    this.assertUserActive(user.status);

    // rotate session.
    await this.sessionRepo.revokeById(session.id);

    const sessionContext = await this.createSessionForUser(user.id);
    return this.buildAuthResult(user, sessionContext);
  }

  private async createSessionForUser(userId: string): Promise<{
    session: SessionRecord;
    accessToken: { token: string; expiresAt: Date };
    refreshToken: string;
  }> {
    const refreshToken = this.tokenGenerator.generateRefreshToken();
    const now = this.clock.now();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const session = await this.sessionRepo.create({
      userId,
      refreshToken,
      expiresAt,
    });

    const accessToken = this.tokenGenerator.generateAccessToken({
      sessionId: session.id,
      userId,
    });

    return {
      session,
      accessToken,
      refreshToken,
    };
  }

  private toAuthUser(user: UserRecord): AuthUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      status: user.status,
    };
  }

  private buildAuthResult(
    user: UserRecord,
    sessionContext: {
      accessToken: { token: string; expiresAt: Date };
      refreshToken: string;
    },
  ): AuthResult {
    return {
      user: this.toAuthUser(user),
      token: {
        accessToken: sessionContext.accessToken.token,
        refreshToken: sessionContext.refreshToken,
        expiresAt: sessionContext.accessToken.expiresAt,
      },
    };
  }

  private assertUserActive(status: UserStatus) {
    if (status === 'DISABLED') {
      throw new UserDisabledError();
    }
    if (status === 'DELETED') {
      throw new UserDeletedError();
    }
  }
}
