import { AuthResult, LoginInput, RefreshInput, RegisterInput } from './types';

export interface AuthService {
  register(input: RegisterInput): Promise<AuthResult>;
  login(input: LoginInput): Promise<AuthResult>;
  refresh(input: RefreshInput): Promise<AuthResult>;
}
