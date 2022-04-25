import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const TimerSlice = createSlice({
  name: 'timer',
  // @todo: Add initial State from server?
  initialState: {},
  reducers: {
    start: (state: any) => {
      state.started = true;
    },
    stop: (state: any) => {
      state.started = false;
    },
  },
  extraReducers: {},
});

export const { start, stop } = TimerSlice.actions;
export const selectTimer = (state: RootState) => state.timer;
export default TimerSlice.reducer;
