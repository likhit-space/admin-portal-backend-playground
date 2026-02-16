import { UserIdentity } from '../../domain/user';
import {
  ChangeUserRoleInput,
  ChangeUserRoleOutput,
  GetCurrentUserInput,
  GetCurrentUserOutput,
  GetUserByIdInput,
  GetUserByIdOutput,
  ListUsersInput,
  ListUsersOutput,
  UpdateUserStatusInput,
  UpdateUserStatusOutput,
} from './types';

export interface UserService {
  getCurrentUser(input: GetCurrentUserInput): Promise<GetCurrentUserOutput>;
  getUserById(input: GetUserByIdInput): Promise<GetUserByIdOutput>;
  listUsers(input: ListUsersInput): Promise<ListUsersOutput>;
  updateUserStatus(
    input: UpdateUserStatusInput,
    actor: UserIdentity,
  ): Promise<UpdateUserStatusOutput>;
  changeUserRole(
    input: ChangeUserRoleInput,
    actor: UserIdentity,
  ): Promise<ChangeUserRoleOutput>;
}
