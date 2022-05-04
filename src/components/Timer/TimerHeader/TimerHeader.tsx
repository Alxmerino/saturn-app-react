import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { Add } from '@mui/icons-material';

import { getDurationFromString, hasDuration } from '../../../services/utils';
import { useAppDispatch } from '../../../app/hooks';
import { addTimer } from '../../../store/Timer/TimerSlice';
import { Button, ProjectMenu } from '../../common';
import { ColorCode, Project } from '../../../types/types';

const TimerHeader = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>('');
  const [plannedTime, setPlannedTime] = useState<string>('');
  const [project, setProject] = useState<Partial<Project> | null>(null);
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
    const plannedTimeDuration = getDurationFromString(plannedTime);
    const timerProject = {
      id: nanoid(),
      userId: 'test-user-id',
      title: project?.title ?? '',
      colorCode: project?.colorCode as ColorCode,
    };

    dispatch(
      addTimer({
        title,
        // @todo: Throw error if plannedTime is not a valid duration
        plannedTime: hasDuration(plannedTimeDuration)
          ? plannedTimeDuration
          : null,
        project: timerProject,
      })
    );
    setTitle('');
    setPlannedTime('');
    setProject(null);
    setCanAdd(false);
  };

  const handleOnKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
        onKeyPress={handleOnKeyPress}
      />
      <TextField
        id="timer-limit"
        size="small"
        label="For how long?"
        value={plannedTime}
        onChange={handlePlannedTimeChange}
        onKeyPress={handleOnKeyPress}
        sx={{
          width: 300,
        }}
      />
      <ProjectMenu color="primary" project={project} setProject={setProject} />
      <Button kind="primary" onClick={handleTimerAdd} disabled={!canAdd}>
        <Add />
      </Button>
    </Stack>
  );
};

export default TimerHeader;
