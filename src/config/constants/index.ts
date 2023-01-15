export enum Routes {
  HOME = '/',
  APP = '/app',
  ACCOUNT = '/account',
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

// @todo: Use Material color variables
export const colorMap: { [x: string]: string } = {
  blue: '#1565c0',
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

export const colorNameToCodeMap: { [x: string]: number } = {
  blue: 0,
  turquoise: 2,
  green: 3,
  lime: 4,
  yellow: 5,
  orange: 6,
  red: 7,
  pink: 8,
  purple: 9,
  violet: 10,
  grey: 11,
  black: 1,
};

export const colorCodeToNameMap: { [x: number]: string } = {
  0: 'blue',
  2: 'turquoise',
  3: 'green',
  4: 'lime',
  5: 'yellow',
  6: 'orange',
  7: 'red',
  8: 'pink',
  9: 'purple',
  10: 'violet',
  11: 'grey',
  1: 'black',
};

export const API = {
  BASE_API_URL:
    process.env.REACT_APP_BASE_API_URL ?? 'https://saturn-api.am.dev/api/v1',
};
