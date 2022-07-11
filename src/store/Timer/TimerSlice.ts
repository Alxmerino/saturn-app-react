import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { groupBy, orderBy } from 'lodash';

import { RootState } from '../store';
import { TimerItemTask } from '../../types/types';
import { format } from 'date-fns';
import LocalStore from '../../services/utils/local-store';

// @todo: Add initial State from server?
interface TimerState {
  [x: number]: TimerItemTask[];
}
const initialState: TimerItemTask[] = [];

const reducerName = 'timer';

export const TimerSlice = createSlice({
  name: reducerName,
  initialState() {
    const localState: TimerItemTask[] = LocalStore.get(reducerName);

    // Parse dates from string to Date
    if (localState) {
      localState.forEach((timer) => {
        timer.createdAt = timer.createdAt ? new Date(timer.createdAt) : null;
        timer.updatedAt = timer.updatedAt ? new Date(timer.updatedAt) : null;
        timer.startTime = timer.startTime ? new Date(timer.startTime) : null;
        timer.endTime = timer.endTime ? new Date(timer.endTime) : null;
      });
    }

    return localState || initialState;
  },
  reducers: {
    addTimer(
      state: TimerItemTask[],
      // action: PayloadAction<TimerItemTask>
      action: PayloadAction<
        Pick<
          TimerItemTask,
          | 'id'
          | 'title'
          | 'plannedTime'
          | 'project'
          | 'userId'
          | 'running'
          | 'startTime'
        >
      >
    ) {
      const { id, title, project, userId, running, startTime } = action.payload;

      // const newTimer: TimerItemTask = { ...action.payload };
      const newTimer: TimerItemTask = {
        id: id ?? nanoid(),
        title: title,
        running: running,
        project: project ?? null,
        userId: userId ?? new Date().getTime(),
        startTime:
          typeof startTime === 'string' ? new Date(startTime) : startTime,
        createdAt:
          typeof startTime === 'string' ? new Date(startTime) : startTime,
        endTime: null,
        duration: [],
        totalDuration: 0,
        plannedTime: null,
      };

      state.push(newTimer);

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    removeTimer(state: TimerItemTask[], action: PayloadAction<string>) {
      const id = action.payload;
      // state.filter((timer: TimerItemTask) => timer.id !== id);
      const index = state.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.splice(index, 1);
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    startTimer(state: TimerItemTask[], action: PayloadAction<string>) {
      const id = action.payload;
      const timer = state.find((item) => item.id === id);
      if (timer) {
        timer.running = true;
        timer.startTime = new Date();
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    stopTimer(state: TimerItemTask[], action: PayloadAction<string>) {
      const id = action.payload;
      const timer = state.find((item) => item.id === id);
      if (timer) {
        timer.running = false;
        timer.endTime = new Date();

        // Add a duration entry
        timer.duration.push({
          startTime: timer.startTime,
          endTime: timer.endTime,
        });
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    resetTimer(state: TimerItemTask[], action: PayloadAction<string>) {
      const id = action.payload;
      const timer = state.find((item) => item.id === id);
      if (timer) {
        timer.running = false;
        timer.startTime = null;
        timer.endTime = null;
        timer.duration = [];
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    updateTimer(
      state: TimerItemTask[],
      action: PayloadAction<
        Pick<
          TimerItemTask,
          'id' | 'title' | 'plannedTime' | 'project' | 'duration'
        >
      >
    ) {
      const timer = state.find((item) => item.id === action.payload.id);
      if (timer) {
        const { title, plannedTime, project, duration } = action.payload;

        timer.title = title;
        timer.plannedTime = plannedTime;
        timer.project = project;
        timer.duration = duration;
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
  },
  extraReducers: {},
});

export const {
  addTimer,
  updateTimer,
  removeTimer,
  startTimer,
  stopTimer,
  resetTimer,
} = TimerSlice.actions;
export const selectTimers = (state: RootState) => state.timer;
export const selectTimersByDate = (state: RootState) => {
  const sortedTimers = orderBy(state.timer, 'createdAt', 'desc');
  return groupBy(sortedTimers, (timer) => {
    return format(timer.createdAt, 'yyyy-MM-dd');
  });
};
export default TimerSlice.reducer;
