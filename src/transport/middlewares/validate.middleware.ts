import type { ZodSchema } from 'zod';
import type { Request, Response, NextFunction } from 'express';

type ValidateSchemas = {
  body?: ZodSchema<any>;
  query?: ZodSchema<any>;
  params?: ZodSchema<any>;
};

export function validate<T>(schemas: ValidateSchemas) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validated: any = {};

      if (schemas.body) {
        validated.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.query) {
        validated.query = await schemas.query.parseAsync(req.query);
      }

      if (schemas.params) {
        validated.params = await schemas.params.parseAsync(req.params);
      }

      (req as any).validated = validated;

      next();
    } catch (err) {
      next(err);
    }
  };
}
