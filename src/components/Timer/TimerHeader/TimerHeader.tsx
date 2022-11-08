import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { Add } from '@mui/icons-material';

import { getDurationFromString, hasDuration } from '../../../services/utils';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  addProject,
  addTask,
  addTimer,
  selectProjects,
  updateProject,
} from '../../../store/Timer/TimerSlice';
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
  const projects = useAppSelector(selectProjects);
  const user = useAppSelector(selectCurrentUser);
  const [title, setTitle] = useState<string>('');
  const [plannedTime, setPlannedTime] = useState<string>('');
  const [project, setProject] = useState<Partial<Project> | null>({});
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

    try {
      // Create local timer object
      let task: Task = {
        id: nanoid(),
        title,
        projectId: project?.id ?? null,
        userId: user?.id,
        timers: [],
      };

      const { data: taskResults } = await createTimer({
        ...task,
      });

      task = {
        ...task,
        ...taskResults,
      };

      dispatch(addTask(task));
      // @todo: Update API to support time entries
      dispatch(addTimer(task.id));

      // Reset states
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

  const handleProjectMenuOpen = (el: HTMLElement) => {
    setProjectMenuEl(el);
  };
  const handleProjectMenuClose = (menuProject: {
    title: string;
    colorCode: number;
  }) => {
    let project: Project = {
      id: nanoid(),
      userId: user?.id,
      ...menuProject,
    };

    const existingProject = projects.find(
      (p: Project) => p.title.toLowerCase() === project.title.toLowerCase()
    );

    if (existingProject) {
      project = {
        ...existingProject,
        ...menuProject,
      };
      dispatch(updateProject(project));
    } else {
      project = {
        ...project,
        ...menuProject,
      };
      dispatch(addProject(project));
    }

    setProjectMenuEl(null);
    setProject((state) => ({ ...project }));
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
      <ProjectMenu
        color="primary"
        project={project}
        projectMenuEl={projectMenuEl}
        onOpen={handleProjectMenuOpen}
        onClose={handleProjectMenuClose}
      />
      <Button kind="primary" onClick={handleTimerAdd} disabled={!canAdd}>
        <Add />
      </Button>
    </Stack>
  );
};

export default TimerHeader;
