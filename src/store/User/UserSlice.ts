import {
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { AuthResponse, User } from '../../types/types';
import LocalStore from '../../services/utils/local-store';

export interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
  token: null,
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
  },
  extraReducers: {},
});

export const { setCredentials, setLogin, setLogout } = UserSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectLoggedIn = (state: RootState) => state.auth.isLoggedIn;

export default UserSlice.reducer;
