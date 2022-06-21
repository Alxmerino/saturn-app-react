import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { prepareHeaders, transformResponse } from '../utils/api';
import { API } from '../../config/constants';
import { ProjectResponse } from '../../types/api';

export const saturnApi: any = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API.BASE_API_URL,
    prepareHeaders,
  }),
  endpoints: (builders) => ({
    createTask: builders.mutation<any, any>({
      query: (taskBody) => ({
        url: '/tasks',
        method: 'POST',
        body: { ...taskBody },
      }),
      transformResponse,
    }),
    createProject: builders.mutation<ProjectResponse, ProjectResponse>({
      query: (projectBody) => ({
        url: '/projects',
        method: 'POST',
        // @TODO: Need to transform request
        body: { ...projectBody },
      }),
      transformResponse,
    }),
  }),
});

export const { useCreateProjectMutation, useCreateTaskMutation } = saturnApi;
