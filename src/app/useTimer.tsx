import { useEffect, useMemo, useState } from 'react';
import { Task, TaskTimerItem } from '../types/timer';
import { differenceInSeconds } from 'date-fns';
import {
  durationInSecondsToString,
  getTimersDuration,
} from '../services/utils';

const useTimer = (task: Task) => {
  const { timers } = task;
  const totalTaskDuration = useMemo(() => getTimersDuration(timers), [timers]);
  const activeTimer = timers ? timers.find((t) => t.running) : undefined;
  const [durationInSeconds, setDurationInSeconds] = useState(
    activeTimer?.durationInSeconds ?? 0
  );

  useEffect(() => {
    let interval: any;
    if (activeTimer) {
      interval = setInterval(() => {
        const timeDiffInSeconds = differenceInSeconds(
          Date.now(),
          new Date(activeTimer.startTime ?? 0)
        );

        setDurationInSeconds(timeDiffInSeconds);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [activeTimer]);

  return {
    durationInSeconds,
    taskDurationInSeconds: totalTaskDuration,
    duration: durationInSecondsToString(durationInSeconds),
    running: Boolean(activeTimer),
    activeTimer,
  };
};

export { useTimer };
