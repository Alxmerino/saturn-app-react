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

export const colorMap: { [x: string]: string } = {
  blue: '#2196f3',
  turquoise: '#009688',
  green: '#4caf50',
  lime: '#cddc39',
  yellow: '#ffeb3b',
  orange: '#ff9800',
  red: '#b71c1c',
  pink: '#e91e63',
  purple: '#9c27b0',
  violet: '#673ab7',
  grey: '#9e9e9e',
  black: '#000000',
};
