import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store/store';
import { AuthResponse, LoginRequest, MessageResponse } from '../../types/types';
import { prepareHeaders, transformResponse } from '../utils/api';
import { API } from '../../config/constants';

interface FinalLoginRequest extends LoginRequest {
  device_name?: string;
}

export const saturnAuthApi: any = createApi({
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
  }),
});

export const { useLoginMutation, useLogoutMutation } = saturnAuthApi;
