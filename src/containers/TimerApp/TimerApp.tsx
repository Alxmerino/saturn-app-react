import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  Input,
  Link,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { push } from 'redux-first-history';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectLoggedIn } from '../../store/User/UserSlice';
import { Routes } from '../../config/constants';
import { Button, Text } from '../../components/common';

const TimerApp = () => {
  const loggedIn = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [projectAnchorEl, setProjectAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const projectOpen = Boolean(projectAnchorEl);

  const handleProjectClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProjectAnchorEl(event.currentTarget);
  };
  const handleProjectClose = () => {
    setProjectAnchorEl(null);
  };

  const handleLogOut = () => {
    dispatch(logout());
    dispatch(push(Routes.HOME));
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  /**
   * Redirect home the user if not logged in
   */
  useEffect(() => {
    if (!loggedIn) {
      dispatch(push(Routes.HOME));
    }
  });

  // @todo: remove Sample data
  function addDays(date: Date, days: number) {
    const copy = new Date(Number(date.getDate()));
    copy.setDate(date.getDate() + days);
    return copy;
  }
  const now: Date = new Date();
  const dates = ['Today', 'Yesterday', 'Mon, 25 Mar'];
  const timers = [
    {
      description: 'This is a timer',
      project: 'PG-1567',
      color: 'purple',
      active: false,
      time: '01:37:32',
      planned: '2h',
    },
    {
      description: 'This is another timer',
      project: 'PG-1568',
      color: 'blue',
      active: true,
      time: '00:28:15',
      planned: '3h',
    },
    {
      description: '[int] Marketing Standup',
      project: 'WM-2',
      color: 'green',
      active: false,
      time: '03:46:54',
      planned: '',
    },
    {
      description: '[ext] Design Discovery',
      project: '',
      color: 'deepOrange',
      active: false,
      time: '00:00:00',
      planned: '1h 30',
    },
  ];

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'grey.100',
          pt: 1,
          px: 2,
          pb: 2,
        }}
      >
        <Text component="h1" variant="h6" align="center">
          Saturn Time Tracker
        </Text>
        {/* @todo: Add Component */}
        {/* Start Timer Header Component */}
        <Stack direction="row" pt={3} spacing={2}>
          <TextField
            id="timer-description"
            size="small"
            fullWidth
            label="What are you working on?"
          />
          <TextField
            id="timer-limit"
            size="small"
            label="For how long?"
            sx={{
              width: 300,
            }}
          />
          <Button
            type="outlined"
            id="project-select-button"
            aria-controls={projectOpen ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={projectOpen ? 'true' : undefined}
            onClick={handleProjectClick}
          >
            <DeveloperBoardIcon />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={projectAnchorEl}
            open={projectOpen}
            onClose={handleProjectClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem>
              <Input
                placeholder="Project Name"
                inputProps={{ 'aria-label': 'description' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleProjectClose();
                  }
                }}
              />
            </MenuItem>
            <MenuItem onClick={handleProjectClose}>TEST-123</MenuItem>
          </Menu>
          <Button type="primary">
            <AddIcon />
          </Button>
        </Stack>
        {/* End Timer Header Component */}
      </Box>

      {/* @todo: Add active timer */}
      {/* @todo: Add timer list */}
      <Box pt={2}>
        {dates.map((date, i) => (
          <Accordion
            // expanded={expanded === `panel-${i}`}
            // elevation={0}
            expanded={true}
            // disableGutters
            onChange={handleChange(`panel-${i}`)}
            key={i}
            sx={{ borderTop: '1px solid #e0e0e0' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${i}-content`}
              id={`panel${i}-header`}
              sx={{
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: 'grey.300',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  mr: 1,
                }}
              >
                <Text component="strong" fontWeight="bold">
                  {date}
                </Text>
                <Text component="strong" fontWeight="bold">
                  6h 20m/7h
                </Text>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {timers.map((timer) => (
                <Box
                  key={timer.description}
                  sx={{
                    py: 1,
                    px: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: timer.active ? 'blue.50' : '',
                    borderBottomWidth: 1,
                    borderBottomStyle: 'solid',
                    borderBottomColor: 'grey.300',
                  }}
                >
                  <div>
                    <Text>{timer.description}</Text>
                    {timer.project !== '' ? (
                      <Text
                        component="strong"
                        fontWeight="bold"
                        color={timer.color}
                      >
                        {timer.project}
                      </Text>
                    ) : (
                      <IconButton size="small" sx={{ color: 'grey.600' }}>
                        <DeveloperBoardIcon />
                      </IconButton>
                    )}
                  </div>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Text color="grey.700">{`${timer.time}/${timer.planned}`}</Text>
                    <IconButton color="primary" size="small" sx={{ ml: 1 }}>
                      {timer.active ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Link variant="body2" onClick={handleLogOut}>
        Log out
      </Link>
    </>
  );
};

export default TimerApp;
