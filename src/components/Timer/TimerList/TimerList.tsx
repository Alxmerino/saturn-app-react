import React, { useEffect, useMemo, useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

import { Text } from '../../common';
import { TimerTask } from '../index';
import { Task, TaskTimerItem, User } from '../../../types/types';
import { isToday, isYesterday, parse } from 'date-fns';
import {
  formatDurationString,
  getTaskTotalDuration,
} from '../../../services/utils';

export interface TimerListProps {
  date: string;
  tasks: Task[];
  user: User;
}

const TimerList = ({ date, tasks, user }: TimerListProps) => {
  const now: Date = new Date();
  const headerDate: Date = parse(date, 'yyyy-MM-dd', now);
  const [expanded, setExpanded] = useState<boolean>(true);
  const tasksDuration = useMemo(() => getTaskTotalDuration(tasks), [tasks]);
  const [totalDuration, setTotalDuration] = useState<number>(tasksDuration);
  const [runningDuration, setRunningDuration] = useState<number>(0);
  const totalPlannedTime = false;

  const handleTimerDurationUpdate = (duration: number) => {
    setRunningDuration(duration);
  };

  const handleChange = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setTotalDuration(tasksDuration + runningDuration);
  }, [runningDuration]);

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
        {tasks.map((task) => (
          <TimerTask
            task={task}
            key={task.id}
            user={user}
            onDurationUpdate={handleTimerDurationUpdate}
          />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default TimerList;
