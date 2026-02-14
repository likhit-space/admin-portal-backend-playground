import type { Request, Response } from 'express';
import { AuthService } from '../../core/auth/auth-service';
import { LoginRequest, RefreshRequest, RegisterRequest } from './auth.schemas';

export function createAuthController(authService: AuthService) {
  const register = async (req: Request, res: Response) => {
    const { body } = req.validated as { body: RegisterRequest };
    const result = await authService.register(body);
    return res.status(201).json(result);
  };

  const login = async (req: Request, res: Response) => {
    const { body } = req.validated as { body: LoginRequest };
    const result = await authService.login(body);
    return res.status(200).json(result);
  };

  const refresh = async (req: Request, res: Response) => {
    const { body } = req.validated as { body: RefreshRequest };
    const result = await authService.refresh(body);
    return res.status(200).json(result);
  };

  return {
    register,
    login,
    refresh,
  };
}
