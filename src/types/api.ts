import { User } from './timer';

export interface ServerResponse<T> {
  data: T;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}
