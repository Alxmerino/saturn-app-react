import {
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { AuthResponse, User } from '../../types/types';
import LocalStore from '../../services/utils/local-store';

export type IntegrationType = 'JIRA';

export interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  integration: {
    name: IntegrationType | null;
    metadata: Record<string, unknown> | null;
  };
  session?: Record<string, unknown> | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
  token: null,
  integration: {
    name: null,
    metadata: null,
  },
  session: null,
};

const reducerName = 'auth';

function getInitialState() {
  const localState: UserState = LocalStore.get(reducerName, true);

  return localState ?? initialState;
}

export const UserSlice = createSlice({
  name: reducerName,
  initialState: getInitialState(),
  reducers: {
    setLogin: (state: UserState) => {
      state.isLoggedIn = true;

      // Save to local storage
      LocalStore.set(reducerName, state, true);
    },
    setLogout: (state) => {
      state.isLoggedIn = false;

      // Save to local storage
      LocalStore.set(reducerName, state, true);
    },
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<AuthResponse>
    ) => {
      state.user = user;
      state.token = token;

      // Save to local storage
      LocalStore.set(reducerName, state, true);
    },
    setIntegration: (state, { payload }: PayloadAction<any>) => {
      state.integration = payload.integration;

      // Save to local storage
      LocalStore.set(reducerName, state, true);
    },
    setSession: (state, { payload }: PayloadAction<any>) => {
      state.session = payload;

      // Save to local storage
      LocalStore.set(reducerName, state, true);
    },
  },
  extraReducers: {},
});

export const {
  setCredentials,
  setLogin,
  setLogout,
  setIntegration,
  setSession,
} = UserSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectUserIntegration = (state: RootState) =>
  state.auth.integration;
export const selectUserSession = (state: RootState) => state.auth.session;
export const selectLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export default UserSlice.reducer;
