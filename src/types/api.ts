import { DateType, User } from './timer';
import { Task } from '../services/api/saturnApi';

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

export interface ProjectRequest {
  id?: number;
  title: string;
  color_code?: string;
}

export interface ProjectResponse {
  color_code?: number;
  created_at: string;
  id: number;
  title: string;
  updated_at: string;
  user_id: number;
}

export interface TaskRequest {
  title?: string;
  running?: boolean;
  project_id?: number;
  // This is sent as a string of JSON
  duration?: string;
  totalDuration?: number;
  start_time?: DateType;
  end_time?: DateType;
}

export type TaskResponse = Task;
