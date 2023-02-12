import { createSlice, PayloadAction } from '@reduxjs/toolkit';

enum AppType = 'SaturnWebApp' | 'SaturnTauriApp';

interface AppState {
  app: AppType;
}

const reducerName = 'app';

export const AppSlice = createSlice({
  name: reducerName,
  initialState() {
    return {
      app: 'SaturnWebApp',
    };
  },
  reducers: {
    setApp(state: AppState, action: PayloadAction<AppType>) {
      state.app = action.payload;
    },
  },
});

export const { setApp } = AppSlice.actions;
