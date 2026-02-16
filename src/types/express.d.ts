import 'express';
import { UserRole } from '../infra/persistence';

declare global {
  namespace Express {
    interface Request {
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
