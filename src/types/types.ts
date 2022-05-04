interface Timestamps {
  createdAt?: Date | null;
  updatedAt?: Date | null;
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

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project extends Timestamps {
  id: string;
  title: string;
  userId: string;
  colorCode: ColorCode | null;
}

interface StartEndTime {
  startTime: Date | string | null;
  endTime: Date | string | null;
}

interface Task extends StartEndTime, Timestamps {
  id: string;
  title: string;
  running: boolean;
  project: Project | null;
  userId: string;
  duration: StartEndTime[];
  plannedTime: Duration | null;
}

export interface TimerItemTask extends Task {}
