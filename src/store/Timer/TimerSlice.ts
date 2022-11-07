import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { groupBy, orderBy } from 'lodash';

import { RootState } from '../store';
import { Project, Task, TaskTimerItem } from '../../types/types';
import { format } from 'date-fns';
import LocalStore from '../../services/utils/local-store';

// @todo: Add initial State from server?
interface TimerState {
  tasks: Task[];
  projects: Project[];
  [x: string]: Project[] | Task[];
}

const initialState: TimerState = {
  tasks: [],
  projects: [],
};

const reducerName = 'task';

export const TimerSlice = createSlice({
  name: reducerName,
  initialState() {
    const localState: TimerState = LocalStore.get(reducerName);

    // Parse dates from string to Date
    if (localState) {
      Object.keys(localState).forEach((state: string) => {
        const stateItem = localState[state];

        if (stateItem.length) {
          stateItem.forEach((item: Project | Task) => {
            if ('createdAt' in item) {
              item.createdAt = item.createdAt ? new Date(item.createdAt) : null;
            }
            if ('updatedAt' in item) {
              item.updatedAt = item.updatedAt ? new Date(item.updatedAt) : null;
            }

            if ('timers' in item && item.timers.length) {
              item.timers.forEach((timer) => {
                timer.startTime = timer.startTime
                  ? new Date(timer.startTime)
                  : null;
                timer.endTime = timer.endTime ? new Date(timer.endTime) : null;
              });
            }
          });
        }
      });
    }

    return localState || initialState;
  },
  reducers: {
    addTask(state: TimerState, action: PayloadAction<Task>) {
      const taskAction = action.payload;

      const task: Task = {
        ...taskAction,
        createdAt:
          typeof taskAction.createdAt === 'string'
            ? new Date(taskAction.createdAt)
            : taskAction.createdAt,
        updatedAt:
          typeof taskAction.updatedAt === 'string'
            ? new Date(taskAction.updatedAt)
            : taskAction.updatedAt,
        projectId: taskAction.projectId ?? null,
      };

      state.tasks.push(task);

      LocalStore.set(reducerName, state);
    },
    removeTask(state: TimerState, action: PayloadAction<string>) {
      const id = action.payload;
      const taskIndex = state.tasks.findIndex((item) => item.id === id);

      if (taskIndex > -1) {
        state.tasks.splice(taskIndex, 1);
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    updateTask(
      state: TimerState,
      action: PayloadAction<Pick<TaskTimerItem, 'id' | 'title' | 'projectId'>>
    ) {
      const { id, title, projectId } = action.payload;
      const task = state.tasks.find((item) => item.id === id);

      if (task) {
        task.title = title;
        task.projectId = projectId;
      }
    },
    addTimer(state: TimerState, action: PayloadAction<TaskTimerItem>) {
      const {
        id,
        title,
        userId,
        taskId,
        projectId,
        billable = false,
        running = true,
      } = action.payload;

      const newTimer: TaskTimerItem = {
        id: id ?? nanoid(),
        title,
        userId,
        taskId,
        projectId: projectId ?? null,
        billable,
        running,
        duration: '',
        durationInSeconds: 0,
        startTime: new Date(),
        endTime: new Date(),
      };

      const task = state.tasks.find((item) => item.id === taskId);

      if (task) {
        task.timers.push(newTimer);
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    removeTimer(
      state: TimerState,
      action: PayloadAction<{ taskId: string; timerId: string }>
    ) {
      const { taskId, timerId } = action.payload;
      const task = state.tasks.find((item) => item.id === taskId);

      if (task?.timers.length) {
        const timerIndex = task.timers.findIndex((item) => item.id === timerId);

        if (timerIndex) {
          task.timers.splice(timerIndex, 1);
        }
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    startTimer(
      state: TimerState,
      action: PayloadAction<{ taskId: string; timerId: string }>
    ) {
      const { taskId, timerId } = action.payload;
      const task = state.tasks.find((item) => item.id === taskId);

      if (task?.timers.length) {
        const timer = task.timers.find((item) => item.id === timerId);

        if (timer) {
          timer.running = true;
          timer.startTime = new Date();
        }
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    stopTimer(
      state: TimerState,
      action: PayloadAction<{ taskId: string; timerId: string }>
    ) {
      const { taskId, timerId } = action.payload;
      const task = state.tasks.find((item) => item.id === taskId);

      if (task?.timers.length) {
        const timer = task.timers.find((item) => item.id === timerId);

        if (timer) {
          timer.running = false;
          timer.endTime = new Date();
          // @todo: Calculate duration
        }
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    resetTimer(state: TimerState, action: PayloadAction<string>) {
      const taskId = action.payload;
      const task = state.tasks.find((item) => item.id === taskId);

      if (task) {
        task.timers = [];
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
    updateTimer(
      state: TimerState,
      // action: PayloadAction<any>
      //   // action: PayloadAction<Task>[]
      action: PayloadAction<
        Pick<
          TaskTimerItem,
          'id' | 'title' | 'taskId' | 'projectId' | 'billable'
        >
      >
    ) {
      const { id, title, taskId, projectId, billable } = action.payload;
      const task = state.tasks.find((item) => item.id === taskId);

      if (task?.timers.length) {
        const timer = task.timers.find((item) => item.id === id);

        if (timer) {
          // @TODO: If the title is different, create a new task?
          // timer.title = title;
          timer.projectId = projectId;
          timer.billable = billable;
        }
      }

      // Save to local storage
      LocalStore.set(reducerName, state);
    },
  },
  extraReducers: {},
});

export const {
  addTask,
  removeTask,
  updateTask,
  addTimer,
  updateTimer,
  removeTimer,
  startTimer,
  stopTimer,
  resetTimer,
} = TimerSlice.actions;
export const selectTimers = (state: RootState) => state.timer;
export const selectTasksByDate = (state: RootState) => {
  const sortedTasks = orderBy(state.timer.tasks, 'createdAt', 'desc');
  return groupBy(sortedTasks, (task) => {
    return format(task.createdAt, 'yyyy-MM-dd');
  });
};
export default TimerSlice.reducer;
