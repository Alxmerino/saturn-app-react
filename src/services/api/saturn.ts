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
    credentials: 'include',
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
    // @todo: Fix types
    assignTimerProject: builders.mutation<any, any>({
      query: (args) => ({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/tasks/${args.id}/add-project`,
        method: 'POST',
        body: transformBody({ ...args.data }),
      }),
      transformResponse,
    }),
    // @todo: Fix types
    updateTimer: builders.mutation<string | number, any>({
      query: (args: any) => ({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/tasks/${args.id}`,
        method: 'PUT',
        body: transformBody({ ...args.timer }),
      }),
    }),
    // @todo: Fix types
    deleteTimer: builders.mutation<string | number, any>({
      query: (id: string | number) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
    }),

    /**
     * JIRA Endpoints
     */
    jiraLogin: builders.mutation<any, any>({
      query: (args) => ({
        url: '/integration/jira/auth/session/login',
        method: 'POST',
        body: transformBody(args),
      }),
    }),
    jiraLogout: builders.mutation<any, any>({
      query: (args) => ({
        url: '/integration/jira/auth/session/logout',
        method: 'DELETE',
        body: transformBody(args),
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useUpdateProjectByTitleMutation,
  useCreateProjectMutation,
  useCreateTimerMutation,
  useAssignTimerProjectMutation,
  useUpdateTimerMutation,
  useDeleteTimerMutation,

  // JIRA Hooks
  useJiraLoginMutation,
  useJiraLogoutMutation,
} = api;
