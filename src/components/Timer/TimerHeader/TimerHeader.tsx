import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { Add } from '@mui/icons-material';

import { getDurationFromString } from '../../../services/utils';
import { useAppDispatch } from '../../../app/hooks';
import { addTimer } from '../../../store/Timer/TimerSlice';
import { Button, ProjectMenu } from '../../common';

const TimerHeader = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>('');
  const [plannedTime, setPlannedTime] = useState<string>('');
  const [canAdd, setCanAdd] = useState<boolean>(false);

  const handleOnTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setCanAdd(event.target.value.length > 0);
  };

  const handlePlannedTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlannedTime(event.target.value);
  };

  const handleTimerAdd = () => {
    dispatch(
      addTimer({
        title,
        // @todo: Throw error if plannedTime is not a valid duration
        plannedTime: getDurationFromString(plannedTime),
      })
    );
    setTitle('');
    setPlannedTime('');
    setCanAdd(false);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTimerAdd();
    }
  };

  return (
    <Stack direction="row" pt={3} spacing={2}>
      <TextField
        id="timer-description"
        size="small"
        fullWidth
        label="What are you working on?"
        value={title}
        onChange={handleOnTitleChange}
        onKeyPress={onKeyPress}
      />
      <TextField
        id="timer-limit"
        size="small"
        label="For how long?"
        value={plannedTime}
        onChange={handlePlannedTimeChange}
        onKeyPress={onKeyPress}
        sx={{
          width: 300,
        }}
      />
      <ProjectMenu color="primary" />
      <Button kind="primary" onClick={handleTimerAdd} disabled={!canAdd}>
        <Add />
      </Button>
    </Stack>
  );
};

export default TimerHeader;
