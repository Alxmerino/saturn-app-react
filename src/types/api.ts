import { DateType, Project, User } from './timer';

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

export interface TimerRequest {
  id: string | number;
  title: string;
  user_id: number;
  task_id: number;
  project_id: number;
  billable: boolean;
  running: boolean;
  duration: string;
  duration_in_seconds: number;
  start_time: DateType;
  end_time: DateType;
  created_at: DateType;
  updated_at: DateType;
}

export interface JIRAWorklogRequest {
  base_jira_url: string;
  comment: string;
  device_name: string;
  project: Project;
  started: string;
  time_spent_seconds: number;
  user: string;
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

export interface TimerResponse {
  id: number;
  title: string;
  user_id: number;
  task_id: number;
  project_id: number;
  billable: number;
  running: number;
  duration: string;
  duration_in_seconds: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}
