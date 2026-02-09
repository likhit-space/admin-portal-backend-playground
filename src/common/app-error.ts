/**
 * Base class for all application-level errors.
 *
 * - Used as a contract between core / infra / transport
 * - NOT a business error itself
 * - NOT tied to HTTP or any transport
 */
export abstract class AppError extends Error {
  /**
   * Stable error code used for mapping and decision making.
   * Example: INVALID_CREDENTIALS, USER_DISABLED
   */
  abstract readonly code: string;

  /**
   * Marker for expected / operational errors.
   * Unexpected errors should not extend AppError.
   */
  readonly isOperational = true;

  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    // Fix prototype chain for instanceof (important in TS)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
