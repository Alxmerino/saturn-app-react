import React from 'react';
import { getDurationFromString, getTotalDuration } from './parse-time';

test('It parses ISO 8601 date strings', () => {
  const timeStr1 = '3h';
  const timeStr2 = '1hour';
  const timeStr3 = '3 hours';
  const timeStr4 = '15m';
  const timeStr5 = '15min';
  const timeStr6 = '15 minutes';
  const timeStr7 = '3h 45m';
  const timeStr8 = '3h 45 minutes';
  const timeStr9 = '3 hour 45min';
  const timeStr10 = '3 hour 45 minutes 57 sec';

  expect(getDurationFromString(timeStr1)).toStrictEqual({ hours: 3 });
  expect(getDurationFromString(timeStr2)).toStrictEqual({ hours: 1 });
  expect(getDurationFromString(timeStr3)).toStrictEqual({ hours: 3 });
  expect(getDurationFromString(timeStr4)).toStrictEqual({ minutes: 15 });
  expect(getDurationFromString(timeStr5)).toStrictEqual({ minutes: 15 });
  expect(getDurationFromString(timeStr6)).toStrictEqual({ minutes: 15 });
  expect(getDurationFromString(timeStr7)).toStrictEqual({
    hours: 3,
    minutes: 45,
  });
  expect(getDurationFromString(timeStr8)).toStrictEqual({
    hours: 3,
    minutes: 45,
  });
  expect(getDurationFromString(timeStr9)).toStrictEqual({
    hours: 3,
    minutes: 45,
  });
  expect(getDurationFromString(timeStr10)).toStrictEqual({
    hours: 3,
    minutes: 45,
    seconds: 57,
  });
});

test('It gets the sum of a durations array', () => {
  const durations = [
    { hours: 1 },
    { minutes: 15 },
    { hours: 3, minutes: 45 },
    { hours: 1, minutes: 20 },
    { hours: 0, minutes: 10, seconds: 0 },
  ];

  expect(getTotalDuration(durations)).toBe('6h 30m');
});
