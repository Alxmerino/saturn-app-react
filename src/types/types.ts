interface Timestamps {
  created_at: Date;
  updated_at: Date;
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
  user_id: string;
  color_code: ProjectCode;
}

interface Task extends Timestamps {
  id: string;
  title: string;
  running: boolean;
  project_id: Project | null;
  user_id: string;
  duration: number;
  start_time: number;
  end_time: number;
}

export interface TimerItem extends Task {}
