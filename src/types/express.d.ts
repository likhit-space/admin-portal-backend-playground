import 'express';
import { UserRole } from '../domain/user';

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      user?: {
        userId: string;
        role: UserRole;
      };
      validated?: {
        body?: any;
        query?: any;
        params?: any;
      };
    }
  }
}
