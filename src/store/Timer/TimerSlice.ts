import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TimerItem } from '../../types/types';

// @todo: Add initial State from server?
interface TimerState {
  [x: number]: TimerItem[];
}
const initialState: TimerItem[] = [];

export const TimerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    addTimer(
      state: TimerItem[],
      action: PayloadAction<Pick<TimerItem, 'title' | 'plannedTime'>>
    ) {
      const { title, plannedTime } = action.payload;
      const now: Date = new Date();
      const nowTS: number = now.getTime();

      const newTimer = {
        // @todo: Add unique id
        id: nowTS.toString(),
        title: title,
        running: false,
        projectId: null,
        // @todo: Get proper user id
        userId: nowTS.toString(),
        duration: null,
        startTime: null,
        endTime: null,
        plannedTime: plannedTime,
      };

      state.push(newTimer);
    },
  },
  extraReducers: {},
});

export const { addTimer } = TimerSlice.actions;
export const selectTimer = (state: RootState) => state.timer;
export default TimerSlice.reducer;
