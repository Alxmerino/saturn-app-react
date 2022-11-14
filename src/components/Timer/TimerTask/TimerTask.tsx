import React, { useEffect, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { add, differenceInSeconds } from 'date-fns';
import { isEqual, isNil } from 'lodash';

import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  MoreVert,
  PlayArrow,
  Pause,
  SendTimeExtension,
  RotateLeft,
  Delete,
} from '@mui/icons-material';

import { ProjectMenu, Text } from '../../common';
import { Project, Task, TaskTimerItem, User } from '../../../types/types';
import {
  formatDurationFromObject,
  formatDurationString,
  getDurationFromString,
  getTimerDuration,
  parseDurationFromTimeString,
  hasDuration,
  getSecondsFromDuration,
  durationInSecondsToString,
} from '../../../services/utils';
import {
  updateTimer,
  removeTimer,
  resetTimer,
  startTimer,
  stopTimer,
  removeTask,
  updateTask,
  updateProject,
  addProject,
  selectProjectById,
  addTimer,
} from '../../../store/Timer/TimerSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  useDeleteTimerMutation,
  useUpdateProjectByTitleMutation,
  useAssignTimerProjectMutation,
  useJiraLogTimeMutation,
  useCreateProjectMutation,
} from '../../../services/api';
import { colorNameToCodeMap } from '../../../config/constants';
import { selectUserIntegration } from '../../../store/User/UserSlice';
import { useTimer } from '../../../app/hooks';

export interface TaskItemProps {
  task: Task;
  onDurationUpdate?: (duration: number) => void;
  user: User;
}

const TimerTask = ({ task, onDurationUpdate, user }: TaskItemProps) => {
  const integration = useAppSelector(selectUserIntegration);
  const getProject = useAppSelector(selectProjectById);
  const taskProject = task.projectId ? getProject(task?.projectId) : null;
  const [updateProjectByTitle] = useUpdateProjectByTitleMutation();
  const [createProject] = useCreateProjectMutation();
  const dispatch = useAppDispatch();
  //   const [deleteTimer] = useDeleteTimerMutation();
  //   const [updateProjectByTitle] = useUpdateProjectByTitleMutation();
  //   const [assignTimerProject] = useAssignTimerProjectMutation();
  //   const [jiraLogTime] = useJiraLogTimeMutation();

  const [projectMenuEl, setProjectMenuEl] = useState<null | HTMLElement>(null);
  const [fieldsEditable, setFieldsEditable] = useState<Record<string, boolean>>(
    {
      title: false,
      plannedTime: false,
      duration: false,
    }
  );
  const [timerAnchorEl, setTimerAnchorEl] = useState<null | HTMLElement>(null);
  const timerOpen = Boolean(timerAnchorEl);
  // const canLogTime = !isNil(integration) && !isNil(project?.title);
  const canLogTime = false;
  const { durationInSeconds, activeTimer, running, taskDurationInSeconds } =
    useTimer(task);

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTimerAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setTimerAnchorEl(null);
  };

  const handleTimerReset = () => {
    if (confirm('Are you sure you want to reset this Task time entries?')) {
      dispatch(resetTimer(task.id));
    }

    handleMoreMenuClose();
  };

  const handleTaskDelete = async () => {
    // @todo: Better way to confirm delete?
    if (confirm('Are you sure you want to delete this task?')) {
      // try {
      //   await deleteTimer(timer.id);
      // } catch (err) {
      //   // @todo: Handle errors
      //   console.error('Delete Task Error', err);
      // }

      dispatch(removeTask(task.id));
      handleMoreMenuClose();
    }
  };

  const handleTimerLog = async () => {
    // try {
    //   // @todo: Check for integration
    //   await jiraLogTime(timer);
    // } catch (err) {
    //   // @todo: Handle errors
    //   console.error('Delete Task Error', err);
    // }
  };

  const handleTimerStart = () => {
    dispatch(addTimer(task.id));
  };

  const handleTimerStop = () => {
    if (activeTimer?.id) {
      dispatch(
        stopTimer({
          taskId: task.id,
          timerId: activeTimer?.id,
          durationInSeconds,
        })
      );
    }
  };

  const handleEditableField = (field: string) => {
    setFieldsEditable({
      title: false,
      plannedTime: false,
      duration: false,
      [field]: !fieldsEditable[field],
    });
  };

  const handleEditableFieldPress = (
    e: any, // Used any so we can use e.target.value
    field: string
  ) => {
    if (e.key === 'Escape') {
      handleEditableField(field);
      return;
    }

    if (e.key === 'Enter') {
      handleEditableField(field);
      const newTaskProps: Task = {
        ...task,
      };

      switch (field) {
        case 'title':
          newTaskProps.title = e.target.value;
          break;
      }

      // @todo: Only update if the value has changed
      dispatch(updateTask(newTaskProps));
    }
  };

  const handleProjectMenuClose = async (menuProject: {
    title: string;
    colorCode: number;
  }) => {
    // @todo: Update API project here
    setProjectMenuEl(null);
  };

  const RenderDuration = () => {
    const duration = running
      ? taskDurationInSeconds + durationInSeconds
      : taskDurationInSeconds;

    return (
      <Text
        color="grey.700"
        component="span"
        onClick={() => handleEditableField('duration')}
        sx={{ cursor: 'pointer' }}
      >
        {formatDurationString(duration)}
      </Text>
    );
  };

  return (
    <Box
      sx={{
        py: 1,
        pr: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        backgroundColor: running ? 'blue.50' : '',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'grey.300',
      }}
    >
      <IconButton
        color="primary"
        size="small"
        sx={{ mr: 1 }}
        onClick={handleMoreMenuOpen}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="more-menu"
        anchorEl={timerAnchorEl}
        open={timerOpen}
        onClose={handleMoreMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {canLogTime && (
          <div>
            <MenuItem onClick={handleTimerLog}>
              <ListItemIcon>
                <SendTimeExtension fontSize="small" />
              </ListItemIcon>
              <ListItemText>Log Time</ListItemText>
            </MenuItem>
            <Divider />
          </div>
        )}
        <MenuItem onClick={handleTimerReset}>
          <ListItemIcon>
            <RotateLeft fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleTaskDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <Box
        sx={{
          flex: 1,
          pr: 2,
        }}
      >
        {fieldsEditable.title ? (
          <TextField
            fullWidth
            hiddenLabel
            autoFocus
            id="timer-title"
            size="small"
            variant="standard"
            defaultValue={task.title}
            onKeyPress={(e) => handleEditableFieldPress(e, 'title')}
            onBlur={() => handleEditableField('title')}
          />
        ) : (
          <Text
            onClick={() => handleEditableField('title')}
            sx={{ cursor: 'pointer' }}
          >
            {task.title}
          </Text>
        )}
        <ProjectMenu
          color="action"
          project={taskProject}
          projectMenuEl={projectMenuEl}
          onOpen={(el: HTMLElement) => setProjectMenuEl(el)}
          onClose={handleProjectMenuClose}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto',
        }}
      >
        <>
          <RenderDuration />
          {/* <RenderPlannedTime /> */}
        </>

        <IconButton
          color="primary"
          size="small"
          sx={{ ml: 1 }}
          onClick={running ? handleTimerStop : handleTimerStart}
        >
          {running ? <Pause /> : <PlayArrow />}
        </IconButton>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto',
          width: '100%',
        }}
      ></Box>
    </Box>
  );
};

export default TimerTask;
