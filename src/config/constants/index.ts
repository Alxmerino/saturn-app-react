import { Duration } from 'date-fns';

export enum Routes {
  HOME = '/',
  APP = '/app',
  LOGIN = '/login',
  SIGNUP = '/signup',
}

export const durationMap: { [x: string]: string } = {
  H: 'hours',
  M: 'minutes',
  S: 'seconds',
};

export const durationMapShort: { [x: string]: string } = {
  hours: 'h',
  minutes: 'm',
  seconds: 's',
};
