import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  AccessTokenExpiredError,
  InvalidAccessTokenError,
} from '../../core/auth/auth-errors';
import { TokenVerifier } from '../../infra/security';

export function authenticate(tokenVerifier: TokenVerifier) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new InvalidAccessTokenError());
    }

    const [, token] = authHeader.split(' ');
    if (!token) {
      return next(new InvalidAccessTokenError());
    }

    try {
      const verified = tokenVerifier.verify(token);
      req.user = {
        userId: verified.userId,
        role: verified.role,
      };
      return next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return next(new AccessTokenExpiredError());
      }
      if (err instanceof jwt.JsonWebTokenError) {
        return next(new InvalidAccessTokenError());
      }
      return next(err);
    }
  };
}
