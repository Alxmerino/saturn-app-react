import {
  differenceInSeconds,
  Duration,
  hoursToSeconds,
  minutesToSeconds,
} from 'date-fns';
import { each, isNaN, isNil } from 'lodash';
import { durationMap, durationMapShort } from '../../config/constants';
import { Task, TaskTimerItem } from '../../types/types';

/**
 * Parse the time string and convert it into an ISO 8601 string.
 * ISO 8601 Format: PnYnMnDTnHnMnS where n is the number
 * for the corresponding interval.
 *
 * @param timeStr
 */
export const createISOString = (timeStr: string[]): string => {
  let outputStr = 'PT';

  each(timeStr, (str) => {
    if (!isNaN(+str)) {
      // Number
      outputStr += str;
    } else {
      // Letter
      outputStr += str.charAt(0);
    }
  });

  return outputStr;
};

export const durationInSecondsToString = (duration: number): string => {
  let outputStr = 'PT';
  const isoDate = new Date();
  isoDate.setHours(0, 0, 0, 0);
  isoDate.setSeconds(duration);
  const [hours, minutes, seconds] = isoDate
    .toTimeString()
    .substr(0, 8)
    .split(':');

  outputStr += `${hours}H${minutes}M${seconds}S`;

  return outputStr;
};

/**
 * Return a Duration object from a human-readable time string. e.g. 3h 20m.
 * Currently only supports hours, minutes, and seconds.
 *
 * @param timeString
 */
export const parseDurationFromString = (timeString: string): Duration => {
  const timeStrArr = timeString.split(/(\d+[a-zA-Z]+)/g);
  const duration: { [x: string]: number } = {};

  each(timeStrArr, (str) => {
    // Get the time value and key e.g. '2' and 'H'
    const [value, fullTimeKey] = [...(str.match(/[a-zA-Z]+|[0-9]+/g) ?? [])];
    // we only need the first letter of the time key
    const timeKey = fullTimeKey.charAt(0);

    // If the time key is in the duration map, add it to the duration object
    duration[durationMap[timeKey]] = +value;
  });

  return duration;
};

/**
 * Return a Duration object from a time string. e.g. 02:30:15
 * @todo: Handle error validation
 * @param timeString
 */
export const parseDurationFromTimeString = (timeString: string): Duration => {
  const [hours, minutes, seconds] = timeString.split(':');

  return {
    hours: +hours,
    minutes: +minutes,
    seconds: +seconds,
  };
};

export const getSecondsFromDuration = (duration: Duration): number => {
  let durationInSeconds = 0;
  if (!hasDuration(duration)) {
    return durationInSeconds;
  }

  for (const time in duration) {
    switch (time) {
      case 'hours':
        durationInSeconds += hoursToSeconds(duration[time] ?? 0);
        break;
      case 'minutes':
        durationInSeconds += minutesToSeconds(duration[time] ?? 0);
        break;
      case 'seconds':
        durationInSeconds += duration[time] ?? 0;
        break;
    }
  }

  return durationInSeconds;
};

/**
 * Clean a string and get the duration object
 *
 * @param timeStr
 */
export const getDurationFromString = (timeStr = ''): Duration => {
  if (timeStr === '') {
    return {};
  }

  const returnStr = timeStr.toUpperCase();
  const cleanedTimeStrArr = returnStr.match(/[a-zA-Z]+|[0-9]+/g) ?? [];

  return parseDurationFromString(cleanedTimeStrArr.join(''));
};

/**
 * Format duration object into a human readable form
 * @param duration
 */
export const formatDurationFromObject = (duration: Duration): string => {
  let durationStr = '';

  if (!isNil(duration.hours)) {
    durationStr += `${duration.hours}${durationMapShort.hours} `;
  }

  if (!isNil(duration.minutes)) {
    durationStr += `${duration.minutes}${durationMapShort.minutes} `;
  }

  if (!isNil(duration.seconds)) {
    durationStr += `${duration.seconds}${durationMapShort.seconds}`;
  }

  return durationStr;
};

export const formatDurationString = (duration: number): string => {
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration / 60 / 60 - hours) * 60);
  const seconds = Math.round(
    ((duration / 60 / 60 - hours) * 60 - minutes) * 60
  );

  return [hours, minutes, seconds]
    .map((time) => {
      const _timeStr = time.toString();
      return _timeStr.length > 1 ? _timeStr : '0' + _timeStr;
    })
    .join(':');
};

export const formatHumanReadableDurationString = (duration: number): string => {
  let durationString = '';
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration / 60 / 60 - hours) * 60);

  if (hours) {
    durationString = `${hours}h`;
  }

  if (minutes) {
    durationString +=
      ' ' +
      (minutes.toString().length > 1
        ? minutes.toString()
        : '0' + minutes.toString()) +
      'm';
  }

  return durationString;
};

export const hasDuration = (duration: Duration): boolean => {
  return Object.keys(duration).length > 0;
};

export const getTotalDuration = (durations: Duration[]): string => {
  let durationStr = '';
  let totalHours = 0;
  let totalMinutes = 0;
  let totalSeconds = 0;
  durations.forEach((duration) => {
    totalHours += duration.hours ?? 0;
    totalMinutes += duration.minutes ?? 0;
    totalSeconds += duration.seconds ?? 0;
  });

  // Convert minutes to hours
  if (totalMinutes > 60) {
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes % 60;
  }

  // Convert seconds to minutes
  if (totalSeconds > 60) {
    totalMinutes += Math.floor(totalSeconds / 60);
  }

  // Return nothing if no hours and minutes
  if (!totalHours && !totalMinutes) {
    return '';
  }

  if (totalHours) {
    durationStr += `${totalHours}${durationMapShort.hours} `;
  }

  if (totalMinutes) {
    durationStr += `${totalMinutes}${durationMapShort.minutes}`;
  }

  return durationStr;
};

export const getTimersDuration = (timers: TaskTimerItem[]) => {
  if (!timers || !timers.length) return 0;

  return timers
    .map(getTimerEntryDuration)
    .reduce((prev, curr) => prev + curr, 0);
};

export const getTimerEntryDuration = ({
  startTime,
  endTime,
}: TaskTimerItem) => {
  return differenceInSeconds(new Date(endTime ?? 0), new Date(startTime ?? 0));
};

export const getTaskTotalDuration = (tasks: Task[]): number => {
  if (!tasks.length) return 0;

  let duration = 0;
  tasks.forEach((task) => {
    duration += getTimersDuration(task.timers);
  });

  return duration;
};
