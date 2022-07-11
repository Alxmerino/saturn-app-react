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

export interface User {
  id: number;
  name: string;
  email: string;
  profilePhotoPath?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Project extends Timestamps {
  id: string;
  title: string;
  userId: string;
  colorCode: ColorCode | null;
}

interface StartEndTime {
  startTime: DateType;
  endTime: DateType;
  manualUpdate?: boolean;
}

interface Task extends Timestamps {
  id: string;
  title: string;
  running: boolean;
  project: Project | null;
  userId: string;
  duration: StartEndTime[];
  totalDuration: number;
  plannedTime: Duration | null;
  startTime: DateType;
  endTime: DateType;
}

export interface TimerItemTask extends Task {}
