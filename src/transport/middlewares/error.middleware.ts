import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../common';
import { mapErrorCodeToHttpStatus } from './error-status';
import { ZodError } from 'zod';

type ValidationDetail = {
  field: string;
  message: string;
};

function normalizeZodError(error: ZodError): ValidationDetail[] {
  const details: ValidationDetail[] = [];
  for (const issue of error.issues) {
    const field = issue.path.join('.') || 'root';
    details.push({
      field,
      message: issue.message,
    });
  }
  return details;
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    const status = mapErrorCodeToHttpStatus(err.code);
    return res.status(status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // Validation Error (Zod)
  if (err instanceof ZodError) {
    const details = normalizeZodError(err);
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload',
        details,
      },
    });
  }

  // -------------------------
  // Unexpected Error
  // -------------------------
  console.error('[Unexpected Error]', err);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    },
  });
}
