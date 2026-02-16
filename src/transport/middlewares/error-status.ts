export function mapErrorCodeToHttpStatus(code: string): number {
  switch (code) {
    // =========================
    // User-related
    // =========================
    case 'USER_NOT_FOUND':
      return 404;

    case 'USER_DISABLED':
    case 'USER_DELETED':
    case 'FORBIDDEN':
      return 403;

    case 'EMAIL_ALREADY_EXISTS':
      return 409;

    // =========================
    // Credential-related
    // =========================
    case 'INVALID_CREDENTIALS':
      return 401;

    // =========================
    // Access token
    // =========================
    case 'INVALID_ACCESS_TOKEN':
      return 401;

    case 'ACCESS_TOKEN_EXPIRED':
      return 401;

    // =========================
    // Refresh token
    // =========================
    case 'INVALID_REFRESH_TOKEN':
      return 401;

    case 'REFRESH_TOKEN_EXPIRED':
      return 401;

    default:
      return 500;
  }
}
