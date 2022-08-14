import React, { useEffect, useMemo, useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

import { Text } from '../../common';
import { TimerItem } from '../index';
import { TimerItemTask } from '../../../types/types';
import { isToday, isYesterday, parse } from 'date-fns';
import {
  getTotalDuration,
  getTimerDuration,
  formatDurationString,
} from '../../../services/utils';
import { selectCurrentUser } from '../../../store/User/UserSlice';
import { useAppSelector } from '../../../app/hooks';

export interface TimerListProps {
  date: string;
  timers: TimerItemTask[];
}

const TimerList = ({ date, timers }: TimerListProps) => {
  const now: Date = new Date();
  const headerDate: Date = parse(date, 'yyyy-MM-dd', now);
  const user = useAppSelector(selectCurrentUser);
  const [expanded, setExpanded] = useState<boolean>(true);
  const totalPlannedTime = getTotalDuration(
    timers.map((timer) => timer.plannedTime ?? {})
  );

  const getTotalTimersDuration = useMemo(() => {
    return timers
      .map((timer) => {
        return getTimerDuration(timer);
      })
      .reduce((acc: number, curr: number) => acc + curr, 0);
  }, [timers]);

  const [totalDuration, setTotalDuration] = useState<number>(0);

  const handleTimerDurationUpdate = (duration: number) => {
    setTotalDuration(totalDuration + duration);
  };

  const handleChange = () => {
    setExpanded(!expanded);
  };

  useEffect((): void => {
    setTotalDuration(getTotalTimersDuration);
  }, [timers]);

  return (
    <Accordion
      expanded={expanded}
      onChange={handleChange}
      sx={{ borderTop: '1px solid #e0e0e0' }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`panel1-content`}
        id={`panel1-header`}
        sx={{
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'grey.300',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            mr: 1,
          }}
        >
          <Text component="strong" fontWeight="bold">
            {isToday(headerDate)
              ? 'Today'
              : isYesterday(headerDate)
              ? 'Yesterday'
              : headerDate.toDateString()}
          </Text>
          <Text component="strong" fontWeight="bold">
            <>
              <span>{formatDurationString(totalDuration)}</span>
              {totalPlannedTime && <span>/{totalPlannedTime}</span>}
            </>
          </Text>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        {timers.map((timer) => (
          <TimerItem
            timer={timer}
            key={timer.id}
            user={user}
            onDurationUpdate={handleTimerDurationUpdate}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default TimerList;
