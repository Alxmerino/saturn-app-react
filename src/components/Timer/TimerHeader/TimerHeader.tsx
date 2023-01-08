import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { Add } from '@mui/icons-material';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  addProject,
  addTask,
  addTimer,
  selectProjects,
  updateProject,
} from '../../../store/Timer/TimerSlice';
import { Button, ProjectMenu } from '../../common';
import { Project, Task } from '../../../types/types';
import {
  useCreateProjectMutation,
  useCreateTaskMutation,
  useUpdateProjectByTitleMutation,
} from '../../../services/api';
import { selectCurrentUser } from '../../../store/User/UserSlice';
import { format } from 'date-fns';
import { isNil } from 'lodash';

const TimerHeader = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const user = useAppSelector(selectCurrentUser);
  const [title, setTitle] = useState<string>('');
  const [plannedTime, setPlannedTime] = useState<string>('');
  const [project, setProject] = useState<Project | null>(null);
  const [canAdd, setCanAdd] = useState<boolean>(false);
  const [projectMenuEl, setProjectMenuEl] = useState<null | HTMLElement>(null);
  const [newProject, setNewProject] = useState<boolean>(true);
  const [updateProjectByTitle] = useUpdateProjectByTitleMutation();
  const [createProject] = useCreateProjectMutation();
  const [createTask] = useCreateTaskMutation();

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

  const handleProjectAdd = async () => {
    let _project = project;
    if (newProject && !isNil(project)) {
      const { data: projectResult, error } = await createProject(project);

      if (!error) {
        _project = projectResult;

        dispatch(addProject({ ...projectResult }));
      } else {
        dispatch(addProject(project));
      }
    }

    return _project;
  };

  const handleTimerAdd = async () => {
    // Handle project add
    let apiProject = null;
    try {
      apiProject = await handleProjectAdd();
    } catch (err) {
      // @todo: Handle errors
      console.error('Create Project Error', err);
    }

    // Handle task add
    try {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // Create local timer object
      let task: Task = {
        id: nanoid(),
        title,
        projectId: apiProject ? apiProject?.id : null,
        userId: user?.id,
        timers: [],
      };

      const { data: taskResults, error } = await createTask({
        ...task,
        // API Needs this to create a new time entry
        startTime: now,
        endTime: now,
      });

      if (!error) {
        task = {
          ...taskResults,
        };

        dispatch(addTask({ ...taskResults, synced: true }));
      } else {
        console.error('API Create Task error', error);
        dispatch(addTask(task));
      }

      // API called probably fail so let's add a local timer
      if (!task.timers.length) {
        dispatch(addTimer({ taskId: task.id }));
      }

      // Reset states
      setTitle('');
      setPlannedTime('');
      setProject(null);
      setCanAdd(false);
      setNewProject(true);
    } catch (err) {
      // @todo: Handle errors
      console.error('Create Task Error', err);
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
  const handleProjectMenuClose = async ({
    title,
    colorCode,
    projectId,
  }: {
    title: string;
    colorCode: number;
    projectId: number | string;
  }) => {
    try {
      const existingProject = projects.find(
        (p: Project) =>
          p.id === projectId || p.title.toLowerCase() === title.toLowerCase()
      );

      if (existingProject) {
        setNewProject(false);
        setProject(existingProject);
      } else if (title !== '') {
        setProject({
          id: nanoid(),
          userId: user?.id,
          title,
          colorCode,
        });
      }
    } catch (err) {
      console.error('Could not create project', err);
    }

    setProjectMenuEl(null);
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
