import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store/store';
import { AuthResponse, LoginRequest, MessageResponse } from '../../types/types';
import { transformResponse } from '../utils/api';

interface FinalLoginRequest extends LoginRequest {
  device_name?: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    // @todo: Set URL via env
    baseUrl: 'https://saturn-api.am.dev/api/v1',
    // baseUrl: 'https://saturn-api-laravel.herokuapp.com/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token: string = (getState() as RootState).auth.token;
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
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

export const { useLoginMutation, useLogoutMutation } = api;
