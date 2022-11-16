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

const TimerHeader = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const user = useAppSelector(selectCurrentUser);
  const [title, setTitle] = useState<string>('');
  const [plannedTime, setPlannedTime] = useState<string>('');
  const [project, setProject] = useState<Partial<Project> | null>({});
  const [canAdd, setCanAdd] = useState<boolean>(false);
  const [projectMenuEl, setProjectMenuEl] = useState<null | HTMLElement>(null);
  const [newProject, setNewProject] = useState<boolean>(true);
  const [updateProjectByTitle] = useUpdateProjectByTitleMutation();
  const [createProject] = useCreateProjectMutation();
  const [createTimer] = useCreateTaskMutation();

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
    // @todo: Only update if existing and menuProject are different
    if (newProject) {
      const { data: projectResult } = await createProject(project);
      _project = { ...project, ...projectResult };

      dispatch(addProject({ ...project, ...projectResult }));
    } else {
      const { data: projectResult } = await updateProjectByTitle({
        ...project,
      });
      _project = { ...project, ...projectResult };

      dispatch(updateProject({ ...project, ...projectResult }));
    }

    return _project;
  };

  const handleTimerAdd = async () => {
    let apiProject = null;
    try {
      apiProject = await handleProjectAdd();
    } catch (err) {
      // @todo: Handle errors
      console.error('Create Project Error', err);
    }

    try {
      // Create local timer object
      let task: Task = {
        id: nanoid(),
        title,
        projectId: apiProject ? apiProject?.id : null,
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
  const handleProjectMenuClose = async (menuProject: {
    title: string;
    colorCode: number;
  }) => {
    // Bail early if color has not changed
    if (project?.colorCode === menuProject.colorCode) {
      setProjectMenuEl(null);
      return;
    }

    const existingProject = projects.find(
      (p: Project) => p.title.toLowerCase() === menuProject.title.toLowerCase()
    );

    if (
      (existingProject && project?.title !== existingProject?.title) ||
      project?.colorCode !== existingProject?.colorCode
    ) {
      setNewProject(false);
      setProject((state) => ({
        ...project,
        ...existingProject,
        ...menuProject,
      }));
    } else {
      setProject((state) => ({
        id: nanoid(),
        userId: user?.id,
        ...menuProject,
      }));
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
