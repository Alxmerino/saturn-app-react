import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { Add } from '@mui/icons-material';

import { getDurationFromString, hasDuration } from '../../../services/utils';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addTask } from '../../../store/Timer/TimerSlice';
import { Button, ProjectMenu } from '../../common';
import {
  ColorCodeName,
  Project,
  Task,
  TaskTimerItem,
} from '../../../types/types';
import {
  useCreateTimerMutation,
  useUpdateProjectByTitleMutation,
} from '../../../services/api';
import { colorNameToCodeMap } from '../../../config/constants';
import { format } from 'date-fns';
import { selectCurrentUser } from '../../../store/User/UserSlice';

const TimerHeader = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [title, setTitle] = useState<string>('');
  const [plannedTime, setPlannedTime] = useState<string>('');
  const [project, setProject] = useState<Partial<Project> | null>(null);
  const [canAdd, setCanAdd] = useState<boolean>(false);
  const [projectMenuEl, setProjectMenuEl] = useState<null | HTMLElement>(null);
  const [updateProjectByTitle] = useUpdateProjectByTitleMutation();
  const [createTimer] = useCreateTimerMutation();

  // @todo: Hide "Planned Time" Field until Notifications are added
  const hidePlannedTime = true;

  const handleOnTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setCanAdd(event.target.value.length > 0);
  };

  const handlePlannedTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPlannedTime(event.target.value);
  };

  const handleTimerAdd = async () => {
    const now: Date = new Date();
    // const plannedTimeDuration = getDurationFromString(plannedTime);

    const taskProject = {};
    // let taskProject = {
    //   title: project?.title ?? '',
    //   colorCode: project?.colorCode ?? 0,
    // };

    try {
      // Update/Create Project on API
      // if (taskProject?.title) {
      //   const { data: projectResults } = await updateProjectByTitle({
      //     ...taskProject,
      //   });
      //
      //   console.log('SERVER PROJECT', projectResults);
      //
      //   // Update local project object
      //   taskProject = projectResults;
      // }

      // Create local timer object
      let task: Task = {
        id: nanoid(),
        title,
        projectId: null,
        userId: user?.id,
        timers: [],
        // @todo: Figure out timezone
        // startTime: format(now, "yyyy-MM-dd'T'H:mm:ss"),
      };
      console.log('OG TASK', task);
      const { data: taskResults } = await createTimer({
        ...task,
      });

      console.log('SERVER TASK', taskResults);

      task = {
        ...task,
        ...taskResults,
      };

      console.log('FINAL TASK', task);

      dispatch(addTask(task));
      setTitle('');
      setPlannedTime('');
      setProject(null);
      setCanAdd(false);
    } catch (err) {
      // @todo: Handle errors
      console.error('Create Project Error', err);
    }
  };

  const handleOnKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await handleTimerAdd();
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
      {!hidePlannedTime && (
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
      )}
      {/* <ProjectMenu */}
      {/* color="primary" */}
      {/* project={project} */}
      {/* setProject={setProject} */}
      {/* projectMenuEl={projectMenuEl} */}
      {/* onOpen={(el: HTMLElement) => setProjectMenuEl(el)} */}
      {/* onClose={() => setProjectMenuEl(null)} */}
      {/* /> */}
      <Button kind="primary" onClick={handleTimerAdd} disabled={!canAdd}>
        <Add />
      </Button>
    </Stack>
  );
};

export default TimerHeader;
