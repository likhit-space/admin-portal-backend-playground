import { UserRole, UserStatus } from "../../domain/user";

export interface User {  
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/* =========================
 * Use Case Inputs / Outputs
 * ========================= */

export interface GetCurrentUserInput {
  userId: string;
}

export interface GetCurrentUserOutput {
  user: User;
}

export interface GetUserByIdInput {
  userId: string;
}

export interface GetUserByIdOutput {
  user: User;
}

export interface ListUsersInput {
  page: number;
  limit: number;
  status?: UserStatus;
}

export interface ListUsersOutput {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateUserStatusInput {
  userId: string;
  newStatus: UserStatus;
}

export interface UpdateUserStatusOutput {
  user: User;
}
