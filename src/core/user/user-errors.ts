import { AppError } from "../../common";

export class UserNotFound extends AppError {
  readonly code = 'USER_NOT_FOUND';

  constructor() {
    super('User not found');
  }
}

export class InvalidUserStatusTransitionError extends AppError {
  readonly code = 'INVALID_USER_STATUS_TRANSITION';

  constructor() {
    super('Invalid user status transition');
  }
}

export class ForbiddenError extends AppError {
  readonly code = 'FORBIDDEN';

  constructor(message = 'You are not allowed to perform this action') {
    super(message);
  }
}