import React, { useState } from 'react';

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

export interface TimerListProps {
  date: string;
  timers: TimerItemTask[];
}

const TimerList = ({ date, timers }: TimerListProps) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  const handleChange = () => {
    setExpanded(!expanded);
  };

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
          <TimerItem timer={timer} key={timer.id} />
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default TimerList;
