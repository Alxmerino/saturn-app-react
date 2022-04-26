import React, { useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

import { ProjectMenu, Text } from '../../common';
import { TimerItem } from '../index';

export interface TimerListProps {
  date: string;
}

const TimerList = ({ date }: TimerListProps) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const handleChange = () => {
    setExpanded(!expanded);
  };

  const timers = [
    {
      description: 'This is a timer',
      project: 'PG-1567',
      color: 'purple',
      active: false,
      time: '01:37:32',
      planned: '2h',
    },
    {
      description: 'This is another timer',
      project: 'PG-1568',
      color: 'blue',
      active: true,
      time: '00:28:15',
      planned: '3h',
    },
    {
      description: '[int] Marketing Standup',
      project: 'WM-2',
      color: 'green',
      active: false,
      time: '03:46:54',
      planned: '',
    },
    {
      description: '[ext] Design Discovery',
      project: '',
      color: 'deepOrange',
      active: false,
      time: '00:00:00',
      planned: '1h 30',
    },
  ];

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
            {date}
          </Text>
          <Text component="strong" fontWeight="bold">
            6h 20m/7h
          </Text>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        {timers.map((timer) => (
          <TimerItem timer={timer} key={timer.time} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default TimerList;
