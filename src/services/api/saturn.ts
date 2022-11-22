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
    createProject: builders.mutation<ProjectResponse, ProjectRequest>({
      query: (projectBody) => ({
        url: '/projects',
        method: 'POST',
        body: transformBody({ ...projectBody }),
      }),
      transformResponse,
    }),
    updateProjectByTitle: builders.mutation<ProjectResponse, ProjectRequest>({
      query: (projectBody) => ({
        url: `/projects/title/${projectBody.title}`,
        method: 'PUT',
        body: transformBody({ ...projectBody }),
      }),
      transformResponse,
    }),

    /**
     * Tasks
     */
    createTask: builders.mutation<TaskResponse, TaskRequest>({
      query: (taskBody) => ({
        url: '/tasks',
        method: 'POST',
        body: transformBody({ ...taskBody }),
      }),
      transformResponse,
    }),
    assignProject: builders.mutation<
      ProjectResponse,
      Partial<ProjectRequest> & Pick<ProjectRequest, 'id'>
    >({
      query: ({ id, ...args }) => ({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/tasks/${id}/add-project`,
        method: 'POST',
        body: transformBody({ ...args }),
      }),
      transformResponse,
    }),
    updateTask: builders.mutation<
      TaskResponse,
      Partial<TaskRequest> & Pick<TaskRequest, 'id'>
    >({
      query: ({ id, ...args }) => ({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/tasks/${id}`,
        method: 'PUT',
        body: transformBody({ ...args }),
      }),
    }),
    deleteTask: builders.mutation<MessageResponse, string | number>({
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
    jiraLogTime: builders.mutation<any, any>({
      query: (timer) => ({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        url: `/integration/jira/issue/${timer.project.title}/worklog`,
        method: 'POST',
        body: transformBody(timer),
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useUpdateProjectByTitleMutation,
  useCreateProjectMutation,
  useCreateTaskMutation,
  useAssignProjectMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,

  // JIRA Hooks
  useJiraLoginMutation,
  useJiraLogoutMutation,
  useJiraLogTimeMutation,
} = api;
