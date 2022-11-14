import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { groupBy, isNil, orderBy } from 'lodash';

import { RootState } from '../store';
import { Project, Task, TaskTimerItem } from '../../types/types';
import { format } from 'date-fns';
import LocalStore from '../../services/utils/local-store';
import { durationInSecondsToISOString } from '../../services/utils';

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
            getTimestamp(item, 'createdAt');
            getTimestamp(item, 'updatedAt');

            if ('timers' in item && item.timers.length) {
              item.timers.forEach((timer) => {
                getTimestamp(timer, 'createdAt');
                getTimestamp(timer, 'updatedAt');
                getTimestamp(timer, 'startTime');
                getTimestamp(timer, 'endTime');
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
        projectId: taskAction.projectId ?? null,
        createdAt: getTimestamp(taskAction, 'createdAt'),
        updatedAt: getTimestamp(taskAction, 'updatedAt'),
      };

      state.tasks.push(task);

      LocalStore.set(reducerName, state);
    },
    removeTask(state: TimerState, action: PayloadAction<string>) {
      const id = action.payload;
      const taskIndex = state.tasks.findIndex((item) => item.id === id);

      if (taskIndex > -1) {
        state.tasks.splice(taskIndex, 1);

        // Save to local storage
        LocalStore.set(reducerName, state);
      }
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

        // Save to local storage
        LocalStore.set(reducerName, state);
      }
    },
    addProject(state: TimerState, action: PayloadAction<Project>) {
      const projectAction = action.payload;

      const project: Project = {
        ...projectAction,
        createdAt: getTimestamp(projectAction, 'createdAt'),
        updatedAt: getTimestamp(projectAction, 'updatedAt'),
      };

      state.projects.push(project);

      LocalStore.set(reducerName, state);
    },
    removeProject(state: TimerState, action: PayloadAction<string>) {
      const id = action.payload;
      const projectIndex = state.projects.findIndex((item) => item.id === id);

      if (projectIndex > -1) {
        state.tasks.splice(projectIndex, 1);

        // Save to local storage
        LocalStore.set(reducerName, state);
      }
    },
    updateProject(
      state: TimerState,
      action: PayloadAction<Pick<Project, 'id' | 'title' | 'colorCode'>>
    ) {
      const { id, title, colorCode } = action.payload;
      const project = state.projects.find((item) => item.id === id);

      if (project) {
        project.title = title;
        project.colorCode = colorCode;

        // Save to local storage
        LocalStore.set(reducerName, state);
      }
    },
    addTimer(state: TimerState, action: PayloadAction<string>) {
      const taskId = action.payload;
      const task = state.tasks.find((item) => item.id === taskId);

      if (task) {
        const newTimer: TaskTimerItem = {
          id: nanoid(),
          title: task.title,
          userId: task.userId,
          taskId: task.id,
          projectId: task?.projectId ?? null,
          // @todo: Update billable
          billable: false,
          running: true,
          duration: '',
          durationInSeconds: 0,
          startTime: new Date(),
          endTime: new Date(),
        };

        task.timers.push(newTimer);

        // Save to local storage
        LocalStore.set(reducerName, state);
      }
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

          // Save to local storage
          LocalStore.set(reducerName, state);
        }
      }
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

          // Save to local storage
          LocalStore.set(reducerName, state);
        }
      }
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

          // Save to local storage
          LocalStore.set(reducerName, state);
        }
      }
    },
    resetTimer(state: TimerState, action: PayloadAction<string>) {
      const taskId = action.payload;
      const task = state.tasks.find((item) => item.id === taskId);

      if (task) {
        task.timers = [];

        // Save to local storage
        LocalStore.set(reducerName, state);
      }
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

          // Save to local storage
          LocalStore.set(reducerName, state);
        }
      }
    },
  },
  extraReducers: {},
});

export const {
  addTask,
  removeTask,
  updateTask,
  addProject,
  removeProject,
  updateProject,
  addTimer,
  updateTimer,
  removeTimer,
  startTimer,
  stopTimer,
  resetTimer,
} = TimerSlice.actions;

export const selectProjects = (state: RootState) => state.timer.projects;
export const selectProjectById =
  (state: RootState) =>
  (projectId: string | number): Project =>
    state.timer.projects.find((p: Project) => p.id === projectId);
export const selectTimers = (state: RootState) => state.timer;
export const selectTasksByDate = (state: RootState) => {
  const sortedTasks = orderBy(state.timer.tasks, 'createdAt', 'desc');
  return groupBy(sortedTasks, (task) => {
    return format(task.createdAt, 'yyyy-MM-dd');
  });
};
export default TimerSlice.reducer;

/**
 * @TODO: Move to utils
 */
const getTimestamp = (obj: any, prop: string) => {
  let timeStamp = null;
  if (!isNil(obj[prop]) && obj[prop] === 'string') {
    timeStamp = new Date(obj[prop]);
  } else if (!isNil(obj[prop])) {
    timeStamp = obj[prop];
  } else {
    timeStamp = new Date();
  }

  return timeStamp;
};
