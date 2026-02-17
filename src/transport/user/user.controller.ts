import { Request, Response } from 'express';
import { UserService } from '../../core/user/user-service';
import {
  ChangeUserRoleRequest,
  ListUsersRequest,
  UpdateUserRequest,
  UserIdRequest,
} from './user.schemas';

export function createUserController(userService: UserService) {
  const getCurrentUser = async (req: Request, res: Response) => {
    const result = await userService.getCurrentUser({
      userId: req.user!.userId,
    });
    return res.status(200).json(result);
  };
  const getUserById = async (req: Request, res: Response) => {
    const { params } = req.validated as { params: UserIdRequest };
    const result = await userService.getUserById({
      userId: params.id,
    });
    return res.status(200).json(result);
  };
  const listUsers = async (req: Request, res: Response) => {
    const { query } = req.validated as { query: ListUsersRequest };
    const input = {
      page: query.page,
      limit: query.limit,
      ...(query.status !== undefined && { status: query.status }),
    };
    const result = await userService.listUsers(input);
    return res.status(200).json(result);
  };
  const updateUserStatus = async (req: Request, res: Response) => {
    const { body } = req.validated as { body: UpdateUserRequest };
    const { params } = req.validated as { params: UserIdRequest };

    const actor = req.user!;

    const result = await userService.updateUserStatus(
      {
        userId: params.id,
        newStatus: body.newStatus,
      },
      actor,
    );
    return res.status(200).json(result);
  };

  const changeUserRole = async (req: Request, res: Response) => {
    const { body, params } = req.validated as {
      body: ChangeUserRoleRequest;
      params: UserIdRequest;
    };

    const actor = req.user!;
    const result = await userService.changeUserRole(
      {
        userId: params.id,
        newRole: body.newRole,
      },
      actor,
    );
    return res.status(200).json(result);
  };

  return {
    getCurrentUser,
    getUserById,
    listUsers,
    updateUserStatus,
    changeUserRole
  };
}
