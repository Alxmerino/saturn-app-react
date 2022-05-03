import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { groupBy } from 'lodash';

import { RootState } from '../store';
import { TimerItemTask } from '../../types/types';
import { format } from 'date-fns';

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
      action: PayloadAction<
        Pick<TimerItemTask, 'title' | 'plannedTime' | 'project'>
      >
    ) {
      const { title, plannedTime, project } = action.payload;
      const now: Date = new Date();
      const nowTS: number = now.getTime();

      const newTimer: TimerItemTask = {
        // @todo: Add unique id
        id: nowTS.toString(),
        title: title,
        running: false,
        project: project ?? null,
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
    removeTimer(state: TimerItemTask[], action: PayloadAction<string>) {
      const id = action.payload;
      // state.filter((timer: TimerItemTask) => timer.id !== id);
      const index = state.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
  extraReducers: {},
});

export const { addTimer, removeTimer } = TimerSlice.actions;
export const selectTimers = (state: RootState) => state.timer;
export const selectTimersByDate = (state: RootState) => {
  return groupBy(state.timer, (timer) => {
    return format(timer.createdAt, 'yyyy-MM-dd');
  });
};
export default TimerSlice.reducer;
