import { Duration } from 'date-fns';
import { each, isNaN } from 'lodash';
import { durationMap, durationMapShort } from '../../config/constants';

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

/**
 * Return a Duration object from the time string. Currently only supports
 * hours, minutes, and seconds.
 *
 * @param timeString
 */
export const parseDurationFromString = (timeString: string): Duration => {
  const timeStrArr = timeString.split(/(?<=[a-zA-Z])(?=[\d])/g);
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
 * Clean a string an get the duration object
 *
 * @param timeStr
 */
export const getDurationFromString = (timeStr = ''): Duration => {
  const returnStr = timeStr.toUpperCase();
  const cleanedTimeStrArr = returnStr.match(/[a-zA-Z]+|[0-9]+/g) ?? [];

  return parseDurationFromString(cleanedTimeStrArr.join(''));
};

/**
 * Format duration object into a human readable form
 * @param duration
 */
export const formatDurationFromObject = (duration: {
  [x: string]: string;
}): string => {
  let durationStr = '';

  if ('hours' in duration) {
    durationStr += `${duration.hours}${durationMapShort.hours} `;
  }

  if ('minutes' in duration) {
    durationStr += `${duration.minutes}${durationMapShort.minutes} `;
  }

  if ('seconds' in duration) {
    durationStr += `${duration.seconds}${durationMapShort.seconds}`;
  }

  return durationStr;
};
