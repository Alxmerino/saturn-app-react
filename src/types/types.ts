interface Timestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectCode =
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'orange'
  | 'purple';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project extends Timestamps {
  id: string;
  title: string;
  userId: string;
  colorCode: ProjectCode;
}

interface Task extends Timestamps {
  id: string;
  title: string;
  running: boolean;
  projectId: Project | null;
  userId: string;
  duration: number | null;
  startTime: number | null;
  endTime: number | null;
  plannedTime: string | null;
}

export interface TimerItem extends Task {}
