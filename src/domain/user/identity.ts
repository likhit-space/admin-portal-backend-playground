import { UserRole } from './role';

export interface UserIdentity {
  userId: string;
  role: UserRole;
}
