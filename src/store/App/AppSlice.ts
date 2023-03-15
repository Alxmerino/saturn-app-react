import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppType = 'SaturnWebApp' | 'SaturnTauriApp';

interface AppState {
  app: AppType;
}

const initialState: AppState = {
  app: 'SaturnWebApp',
};

const reducerName = 'app';

export const AppSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setApp(state: AppState, action: PayloadAction<AppType>) {
      state.app = action.payload;
    },
  },
});

export const { setApp } = AppSlice.actions;
