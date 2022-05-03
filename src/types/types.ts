interface Timestamps {
  createdAt?: Date;
  updatedAt?: Date;
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

interface Task extends Timestamps {
  id: string;
  title: string;
  running: boolean;
  project: Project | null;
  userId: string;
  duration: number | null;
  startTime: Date | null;
  endTime: Date | null;
  plannedTime: Duration | null;
}

export interface TimerItemTask extends Task {}
