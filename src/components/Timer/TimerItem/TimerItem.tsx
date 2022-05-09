import React, { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { isNil } from 'lodash';

import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import { TimerItemTask } from '../../../types/types';
import {
  formatDurationFromObject,
  formatDurationString,
  getTimerDuration,
} from '../../../services/utils';
import {
  removeTimer,
  resetTimer,
  startTimer,
  stopTimer,
} from '../../../store/Timer/TimerSlice';
import { useAppDispatch } from '../../../app/hooks';

export interface TimerItemProps {
  timer: TimerItemTask;
  onDurationUpdate?: (duration: number) => void;
}

const TimerItem = ({ timer, onDurationUpdate }: TimerItemProps) => {
  const canLogTime = false;
  const dispatch = useAppDispatch();
  const [durationInSeconds, setDurationInSeconds] = useState<number>(
    getTimerDuration(timer)
  );
  const [timerAnchorEl, setTimerAnchorEl] = useState<null | HTMLElement>(null);
  // @todo: Add action on slice to update project
  const timerOpen = Boolean(timerAnchorEl);

  const handleTimerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTimerAnchorEl(event.currentTarget);
  };

  const handleTimerClose = () => {
    setTimerAnchorEl(null);
  };

  const handleTimerReset = () => {
    dispatch(resetTimer(timer.id));
    setDurationInSeconds(0);
    if (onDurationUpdate) {
      onDurationUpdate(0);
    }
    handleTimerClose();
  };

  const handleTimerDelete = () => {
    // @todo: Better way to confirm delete?
    if (confirm('Are you sure you want to delete this timer?')) {
      dispatch(removeTimer(timer.id));
      handleTimerClose();
    }
  };

  const handleTimerStart = () => {
    dispatch(startTimer(timer.id));
  };

  const handleTimerStop = () => {
    dispatch(stopTimer(timer.id));
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
        onClose={handleTimerClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {canLogTime && (
          <>
            <MenuItem onClick={handleTimerClose}>
              <ListItemIcon>
                <SendTimeExtension fontSize="small" />
              </ListItemIcon>
              <ListItemText>Log Time</ListItemText>
            </MenuItem>
            <Divider />
          </>
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
      <div>
        <Text>{timer.title}</Text>
        <ProjectMenu color="action" project={timer.project} />
      </div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginLeft: 'auto',
        }}
      >
        <Text color="grey.700">
          <>
            <span>{formatDurationString(durationInSeconds)}</span>
            {!isNil(timer.plannedTime) ? (
              <span>/{formatDurationFromObject(timer.plannedTime)}</span>
            ) : (
              ''
            )}
          </>
        </Text>
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
