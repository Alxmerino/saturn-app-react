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
import { ColorCode, Project, TaskTimerItem, User } from '../../../types/types';
import {
  formatDurationFromObject,
  formatDurationString,
  getDurationFromString,
  getTimerDuration,
  parseDurationFromTimeString,
  hasDuration,
  getSecondsFromDuration,
} from '../../../services/utils';
import {
  updateTimer,
  removeTimer,
  resetTimer,
  startTimer,
  stopTimer,
} from '../../../store/Timer/TimerSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  useDeleteTimerMutation,
  useUpdateProjectByTitleMutation,
  useAssignTimerProjectMutation,
  useJiraLogTimeMutation,
} from '../../../services/api';
import { colorNameToCodeMap } from '../../../config/constants';
import { selectUserIntegration } from '../../../store/User/UserSlice';

export interface TimerItemProps {
  timer: TaskTimerItem;
  onDurationUpdate?: (duration: number) => void;
  user: User | null;
}

const TimerItem = ({ timer, onDurationUpdate, user }: TimerItemProps) => {
  const integration = useAppSelector(selectUserIntegration);
  const dispatch = useAppDispatch();
  const [deleteTimer] = useDeleteTimerMutation();
  const [updateProjectByTitle] = useUpdateProjectByTitleMutation();
  const [assignTimerProject] = useAssignTimerProjectMutation();
  const [jiraLogTime] = useJiraLogTimeMutation();

  const [projectMenuEl, setProjectMenuEl] = useState<null | HTMLElement>(null);
  const [project, setProject] = useState<Partial<Project> | null>(
    timer.project
  );
  const [durationInSeconds, setDurationInSeconds] = useState<number>(
    getTimerDuration(timer)
  );
  const [fieldsEditable, setFieldsEditable] = useState<Record<string, boolean>>(
    {
      title: false,
      plannedTime: false,
      duration: false,
    }
  );
  const [timerRunningOnEdit, setTimerRunningOnEdit] = useState<boolean>(false);
  const [timerAnchorEl, setTimerAnchorEl] = useState<null | HTMLElement>(null);
  const timerOpen = Boolean(timerAnchorEl);
  const canLogTime = !isNil(integration) && !isNil(project?.title);

  const handleTimerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTimerAnchorEl(event.currentTarget);
  };

  const handleTimerMenuClose = () => {
    setTimerAnchorEl(null);
  };

  const handleTimerReset = () => {
    dispatch(resetTimer(timer.id));
    setDurationInSeconds(0);
    if (onDurationUpdate) {
      onDurationUpdate(0);
    }
    handleTimerMenuClose();
  };

  const handleTimerDelete = async () => {
    // @todo: Better way to confirm delete?
    if (confirm('Are you sure you want to delete this timer?')) {
      try {
        await deleteTimer(timer.id);
      } catch (err) {
        // @todo: Handle errors
        console.error('Delete Task Error', err);
      }

      dispatch(removeTimer(timer.id));
      handleTimerMenuClose();
    }
  };

  const handleTimerLog = async () => {
    try {
      // @todo: Check for integration
      console.log('SEND TIMER', JSON.stringify(timer), durationInSeconds);
      await jiraLogTime(timer);
    } catch (err) {
      // @todo: Handle errors
      console.error('Delete Task Error', err);
    }
  };

  const handleTimerStart = () => {
    dispatch(startTimer(timer.id));
  };

  const handleTimerStop = () => {
    dispatch(stopTimer(timer.id));
  };

  const handleEditableField = (field: string) => {
    setFieldsEditable({
      title: false,
      plannedTime: false,
      duration: false,
      [field]: !fieldsEditable[field],
    });

    // Pause timer if editing duration
    if (field !== 'title') {
      if (timer.running) {
        handleTimerStop();
        setTimerRunningOnEdit(true);
      }
    }
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
      const newTimerProps = {
        ...timer,
      };

      switch (field) {
        case 'title':
          newTimerProps.title = e.target.value;
          break;
        case 'plannedTime':
          // @todo: Throw error if plannedTime is not a valid duration
          newTimerProps.plannedTime = hasDuration(e.target.value)
            ? getDurationFromString(e.target.value)
            : null;
          break;
        case 'duration':
          // @todo: Rethink how to handle adding and subtracting duration
          const totalDesiredDuration = getSecondsFromDuration(
            parseDurationFromTimeString(e.target.value)
          );
          const durationDiffInSeconds =
            totalDesiredDuration - durationInSeconds;

          // Only update if there's an actual duration update
          if (durationDiffInSeconds !== 0) {
            const duration = [...newTimerProps.duration];
            const { startTime } = duration[duration.length - 1];

            duration.push({
              manualUpdate: true,
              startTime,
              endTime: add(new Date(startTime ?? 0), {
                seconds: durationDiffInSeconds,
              }).toISOString(),
            });

            newTimerProps.duration = duration;

            // Update timer total duration display
            setDurationInSeconds(durationInSeconds + durationDiffInSeconds);
          }
          break;
      }

      // @todo: Only update if the value has changed
      dispatch(
        updateTimer({
          ...newTimerProps,
        })
      );

      // Restart timer if it was running on edit
      if (timerRunningOnEdit) {
        handleTimerStart();
        setTimerRunningOnEdit(false);
      }
    }
  };

  /**
   * Calculate the duration of the timer
   */
  useEffect(() => {
    let timerInterval: any;
    if (timer.running) {
      timerInterval = setInterval(() => {
        const now = Date.now();
        const existingDuration = getTimerDuration(timer);

        const timeDiffInSeconds = differenceInSeconds(
          now,
          new Date(timer.startTime ?? 0)
        );

        const totalDuration = existingDuration + timeDiffInSeconds;
        setDurationInSeconds(totalDuration);
        if (onDurationUpdate) {
          onDurationUpdate(timeDiffInSeconds);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [timer.running]);

  // Update the project if it changes
  useEffect(() => {
    if (
      !isNil(project) &&
      (timer?.project?.id !== project.id ||
        timer?.project?.title !== project.title ||
        timer?.project?.colorCode !== project.colorCode)
    ) {
      // @todo: Move this to utils?
      const updateOrCreateProject = async () => {
        const { data: projectResults } = await updateProjectByTitle({
          ...timerProject,
          // Send color code as number since that's what the API uses
          // @todo: Fix color conversion when receiving data from API
          color_code: colorNameToCodeMap[project?.colorCode as string],
        });

        const { data: timerResults } = await assignTimerProject({
          id: timer.id,
          data: { projectId: projectResults.id },
        });

        return timerResults;
      };

      const timerProject = {
        ...project,
        id: project?.id ?? nanoid(),
        userId: user?.id ?? nanoid(),
        title: project?.title ?? '',
        colorCode: project?.colorCode as ColorCode,
      };

      updateOrCreateProject()
        .then((data) => {
          dispatch(
            updateTimer({
              ...timer,
              project: data.project,
            })
          );
        })
        .catch((err) => {
          // @todo: handle error
          console.error('Update project error', err);

          dispatch(
            updateTimer({
              ...timer,
              project: timerProject,
            })
          );
        });
    }
  }, [project]);

  const RenderPlannedTime = () => {
    if (isNil(timer.plannedTime)) {
      return null;
    }

    return fieldsEditable.plannedTime ? (
      <>
        /
        <TextField
          id="planned-time"
          fullWidth
          hiddenLabel
          autoFocus
          size="small"
          variant="standard"
          defaultValue={formatDurationFromObject(timer.plannedTime)}
          onKeyPress={(e) => handleEditableFieldPress(e, 'plannedTime')}
          onBlur={() => handleEditableField('plannedTime')}
          sx={{ width: '60px', px: 0.5 }}
        />
      </>
    ) : (
      <Text
        color="grey.700"
        component="span"
        onClick={() => handleEditableField('plannedTime')}
        sx={{ cursor: 'pointer' }}
      >
        {/* Using backticks here because TS is being weird and will throw and error on the Text component */}
        {`/${formatDurationFromObject(timer.plannedTime)}`}
      </Text>
    );
  };

  const RenderDuration = () => {
    return fieldsEditable.duration ? (
      <TextField
        id="duration-time"
        fullWidth
        hiddenLabel
        autoFocus
        size="small"
        variant="standard"
        defaultValue={formatDurationString(durationInSeconds)}
        onKeyPress={(e) => handleEditableFieldPress(e, 'duration')}
        onBlur={() => handleEditableField('duration')}
        sx={{ width: '75px', px: 0.5 }}
      />
    ) : (
      <Text
        color="grey.700"
        component="span"
        onClick={() => handleEditableField('duration')}
        sx={{ cursor: 'pointer' }}
      >
        {formatDurationString(durationInSeconds)}
      </Text>
    );
  };

  return (
    <Box
      sx={{
        py: 1,
        pr: 2,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: timer.running ? 'blue.50' : '',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: 'grey.300',
      }}
    >
      <IconButton
        color="primary"
        size="small"
        sx={{ mr: 1 }}
        onClick={handleTimerClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="more-menu"
        anchorEl={timerAnchorEl}
        open={timerOpen}
        onClose={handleTimerMenuClose}
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
        <MenuItem onClick={handleTimerDelete}>
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
            defaultValue={timer.title}
            onKeyPress={(e) => handleEditableFieldPress(e, 'title')}
            onBlur={() => handleEditableField('title')}
          />
        ) : (
          <Text
            onClick={() => handleEditableField('title')}
            sx={{ cursor: 'pointer' }}
          >
            {timer.title}
          </Text>
        )}
        <ProjectMenu
          color="action"
          project={project}
          setProject={setProject}
          projectMenuEl={projectMenuEl}
          onOpen={(el: HTMLElement) => setProjectMenuEl(el)}
          onClose={() => setProjectMenuEl(null)}
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
          <RenderPlannedTime />
        </>

        <IconButton
          color="primary"
          size="small"
          sx={{ ml: 1 }}
          onClick={timer.running ? handleTimerStop : handleTimerStart}
        >
          {timer.running ? <Pause /> : <PlayArrow />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default TimerItem;
