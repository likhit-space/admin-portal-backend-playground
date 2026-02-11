import type { ZodSchema } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export function validate<T>(schema: ZodSchema<T>) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;

      next();
    } catch (err) {
      next(err);
    }
  };
}
