import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders, transformResponse, transformBody } from '../utils/api';
import { API } from '../../config/constants';
import {
  AuthResponse,
  LoginRequest,
  MessageResponse,
  ProjectRequest,
  ProjectResponse,
  TaskRequest,
  TaskResponse,
} from '../../types/api';

interface FinalLoginRequest extends LoginRequest {
  device_name?: string;
}

export const api: any = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API.BASE_API_URL,
    prepareHeaders,
  }),
  endpoints: (builders) => ({
    login: builders.mutation<AuthResponse, FinalLoginRequest>({
      query: (credentials) => ({
        url: 'auth/tokens/create/',
        method: 'POST',
        body: { ...credentials, device_name: 'web-app' },
      }),
      transformResponse,
    }),
    logout: builders.mutation<
      MessageResponse,
      Pick<FinalLoginRequest, 'email'>
    >({
      query: (credentials) => ({
        url: 'auth/tokens/revoke',
        method: 'DELETE',
        body: { ...credentials, device_name: 'web-app' },
      }),
      transformResponse,
    }),
    createProject: builders.mutation<ProjectResponse, ProjectResponse>({
      query: (projectBody) => ({
        url: '/projects',
        method: 'POST',
        body: { ...projectBody },
      }),
      transformResponse,
    }),
    updateProjectByTitle: builders.mutation<ProjectResponse, ProjectRequest>({
      query: (projectBody) => ({
        url: `/projects/title/${projectBody.title}`,
        method: 'PUT',
        body: { ...projectBody },
      }),
      transformResponse,
    }),
    /**
     * Tasks/Timers
     */
    createTimer: builders.mutation<TaskRequest, TaskResponse>({
      query: (taskBody) => ({
        url: '/tasks',
        method: 'POST',
        body: transformBody({ ...taskBody }),
      }),
      transformResponse,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useUpdateProjectByTitleMutation,
  useCreateProjectMutation,
  useCreateTimerMutation,
} = api;
