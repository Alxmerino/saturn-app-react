import { DateType, User } from './timer';

/**
 * Requests
 */
export interface ServerResponse<T> {
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProjectRequest {
  id: string | number;
  title: string;
  color_code?: string;
}

export interface TaskRequest {
  id: string | number;
  title?: string;
  project_id?: number;
}

/* eslint-disable-next-line */
export interface TimeEntryRequest {
  // @todo
}

/**
 * Responses
 */
export interface MessageResponse {
  message: string;
}

export interface AuthResponse {
  token: string | null;
  user: User | null;
}

export interface ProjectResponse {
  id: number;
  title: string;
  color_code?: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TaskResponse {
  id: number;
  title: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  project: ProjectResponse;
}
