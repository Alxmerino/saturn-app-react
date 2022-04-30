import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { groupBy } from 'lodash';

import { RootState } from '../store';
import { TimerItemTask } from '../../types/types';

// @todo: Add initial State from server?
interface TimerState {
  [x: number]: TimerItemTask[];
}
const initialState: TimerItemTask[] = [];

export const TimerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    addTimer(
      state: TimerItemTask[],
      action: PayloadAction<Pick<TimerItemTask, 'title' | 'plannedTime'>>
    ) {
      const { title, plannedTime } = action.payload;
      const now: Date = new Date();
      const nowTS: number = now.getTime();

      const newTimer: TimerItemTask = {
        // @todo: Add unique id
        id: nowTS.toString(),
        title: title,
        running: false,
        project: null,
        // @todo: Get proper user id
        userId: nowTS.toString(),
        duration: null,
        startTime: null,
        endTime: null,
        createdAt: now,
        plannedTime: plannedTime,
      };

      state.push(newTimer);
    },
  },
  extraReducers: {},
});

export const { addTimer } = TimerSlice.actions;
export const selectTimers = (state: RootState) => state.timer;
export const selectTimersByDate = (state: RootState) => {
  return groupBy(state.timer, (timer) => {
    // @todo: Better way to get date?
    return timer.createdAt.getDay();
  });
};
export default TimerSlice.reducer;
