import React, { useState } from 'react';
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
import { formatDurationFromObject } from '../../../services/utils';
import {
  removeTimer,
  startTimer,
  stopTimer,
} from '../../../store/Timer/TimerSlice';
import { useAppDispatch } from '../../../app/hooks';

export interface TimerItemProps {
  timer: TimerItemTask;
}

const TimerItem = ({ timer }: TimerItemProps) => {
  const dispatch = useAppDispatch();
  const [timerAnchorEl, setTimerAnchorEl] = useState<null | HTMLElement>(null);
  // @todo: Add action on slice to update project
  const timerOpen = Boolean(timerAnchorEl);

  const handleTimerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTimerAnchorEl(event.currentTarget);
  };
  const handleTimerClose = () => {
    setTimerAnchorEl(null);
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
        <MenuItem onClick={handleTimerClose}>
          <ListItemIcon>
            <SendTimeExtension fontSize="small" />
          </ListItemIcon>
          <ListItemText>Log Time</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleTimerClose}>
          <ListItemIcon>
            <RotateLeft fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleTimerDelete();
            handleTimerClose();
          }}
        >
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
            <span>@{timer.duration ?? '00:00'}</span>
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
