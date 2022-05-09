import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';

export interface UserState {
  loggedIn: boolean;
}

const initialState: UserState = {
  loggedIn: true,
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state) => {
      state.loggedIn = true;
    },
    logout: (state) => {
      state.loggedIn = false;
    },
  },
  extraReducers: {},
});

export const { login, logout } = UserSlice.actions;

export const selectLoggedIn = (state: RootState) => state.user.loggedIn;

export default UserSlice.reducer;
