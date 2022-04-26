import React from 'react';
import { Stack, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';

import { Button, ProjectMenu } from '../../common';

const TimerHeader = () => {
  return (
    <Stack direction="row" pt={3} spacing={2}>
      <TextField
        id="timer-description"
        size="small"
        fullWidth
        label="What are you working on?"
      />
      <TextField
        id="timer-limit"
        size="small"
        label="For how long?"
        sx={{
          width: 300,
        }}
      />
      <ProjectMenu color="primary" />
      <Button type="primary">
        <Add />
      </Button>
    </Stack>
  );
};

export default TimerHeader;
