import type { Request, Response } from 'express';
import { AuthService } from '../../core/auth/auth-service';
import { LoginRequest, RefreshRequest, RegisterRequest } from './auth.schemas';

export function createAuthController(authService: AuthService) {
  const register = async (req: Request, res: Response) => {
    const input = req.body as RegisterRequest;
    const result = await authService.register(input);
    return res.status(201).json(result);
  };

  const login = async (req: Request, res: Response) => {
    const input = req.body as LoginRequest;
    const result = await authService.login(input);
    return res.status(200).json(result);
  };

  const refresh = async (req: Request, res: Response) => {
    const input = req.body as RefreshRequest;
    const result = await authService.refresh(input);
    return res.status(200).json(result);
  };

  return {
    register,
    login,
    refresh
  }
}
