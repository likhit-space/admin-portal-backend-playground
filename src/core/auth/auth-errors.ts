import { AppError } from '../../common';

/* =========================
 * User-related errors
 * ========================= */

/**
 * User not found in the system.
 * Can happen during login or refresh.
 */
export class UserNotFoundError extends AppError {
  readonly code = 'USER_NOT_FOUND';

  constructor() {
    super('User not found');
  }
}

/**
 * User exists but is disabled by business policy.
 */
export class UserDisabledError extends AppError {
  readonly code = 'USER_DISABLED';

  constructor() {
    super('User is disabled');
  }
}

/**
 * User was soft-deleted and should be treated as non-existent.
 */
export class UserDeletedError extends AppError {
  readonly code = 'USER_DELETED';

  constructor() {
    super('User is deleted');
  }
}

/**
 * Register flow: email already exists.
 */
export class EmailAlreadyExistsError extends AppError {
  readonly code = 'EMAIL_ALREADY_EXISTS';

  constructor() {
    super('Email already exists');
  }
}

/* =========================
 * Credential-related errors
 * ========================= */

/**
 * Invalid email or password.
 * Intentionally generic for security reasons.
 */
export class InvalidCredentialsError extends AppError {
  readonly code = 'INVALID_CREDENTIALS';

  constructor() {
    super('Invalid email or password');
  }
}

/* =========================
 * Token-related errors
 * ========================= */

/**
 * Access token is missing, malformed, or invalid.
 */
export class InvalidAccessTokenError extends AppError {
  readonly code = 'INVALID_ACCESS_TOKEN';

  constructor() {
    super('Invalid access token');
  }
}

/**
 * Access token has expired.
 */
export class AccessTokenExpiredError extends AppError {
  readonly code = 'ACCESS_TOKEN_EXPIRED';

  constructor() {
    super('Access token has expired');
  }
}

/**
 * Refresh token is missing, malformed, or invalid.
 */
export class InvalidRefreshTokenError extends AppError {
  readonly code = 'INVALID_REFRESH_TOKEN';

  constructor() {
    super('Invalid refresh token');
  }
}

/**
 * Refresh token has expired or revoked.
 */
export class RefreshTokenExpiredError extends AppError {
  readonly code = 'REFRESH_TOKEN_EXPIRED';

  constructor() {
    super('Refresh token has expired');
  }
}
