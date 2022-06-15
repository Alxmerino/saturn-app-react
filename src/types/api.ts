import { User } from './timer';

export interface ServerResponse<T> {
  data: T;
}

export interface MessageResponse {
  message: string;
}

export interface AuthResponse {
  token: string | null;
  user: User | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}
