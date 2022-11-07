export type DateType = Date | string | null;

interface Timestamps {
  createdAt?: DateType;
  updatedAt?: DateType;
}

export type ColorCode =
  | 'blue'
  | 'black'
  | 'grey'
  | 'pink'
  | 'green'
  | 'red'
  | 'yellow'
  | 'orange'
  | 'turquoise'
  | 'purple'
  | 'violet'
  | 'lime';

export interface User extends Timestamps {
  id: number;
  name: string;
  email: string;
  profilePhotoPath?: string | null;
}

export interface Project extends Timestamps {
  id: string;
  title: string;
  userId: string | number;
  colorCode: number | null;
}

// @todo: deprecate
interface StartEndTime {
  startTime: DateType;
  endTime: DateType;
  manualUpdate?: boolean;
}

export interface Task extends Timestamps {
  id: string;
  title: string;
  userId: string;
  plannedTime?: Duration | null;
  projectId?: string | null;
  timers: TaskTimerItem[];
  // @todo: deprecate `project`
  project?: Project | null;
  // @todo: deprecate `running`
  running?: boolean;
  // @todo: deprecate `duration`
  duration?: StartEndTime[];
  // @todo: deprecate `totalDuration`
  totalDuration?: number;
  // startTime: DateType;
  // endTime: DateType;
}

export interface DurationEntry {
  duration: string;
  durationInSeconds: number;
  startTime: DateType;
  endTime: DateType;
}

export interface TaskTimerItem extends DurationEntry {
  id: string;
  title: string;
  userId: string;
  taskId: string;
  projectId: string | null;
  billable: boolean;
  running: boolean;
}
