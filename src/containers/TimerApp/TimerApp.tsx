import React, { useEffect, useState } from 'react';
import { Box, Link, Paper } from '@mui/material';
import { push } from 'redux-first-history';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectLoggedIn } from '../../store/User/UserSlice';
import { Routes } from '../../config/constants';
import { Text } from '../../components/common';
import { TimerHeader, TimerList } from '../../components/Timer';
import { selectTimersByDate } from '../../store/Timer/TimerSlice';

const TimerApp = () => {
  const loggedIn: boolean = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const timersByDate = useAppSelector(selectTimersByDate);
  const timersByDateArray = Object.keys(timersByDate);

  const handleLogOut = () => {
    dispatch(logout());
    dispatch(push(Routes.HOME));
  };

  /**
   * Redirect home the user if not logged in
   */
  useEffect(() => {
    if (!loggedIn) {
      dispatch(push(Routes.HOME));
    }
  });

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
        <TimerHeader />
      </Box>

      <Box pt={2}>
        {timersByDateArray.length > 0 ? (
          timersByDateArray.map((date: string) => (
            <TimerList date={date} timers={timersByDate[date]} key={date} />
          ))
        ) : (
          <Paper elevation={3}>
            <Box px={2} py={3} textAlign="center">
              Work on something exciting!
            </Box>
          </Paper>
        )}
      </Box>

      <Link variant="body2" onClick={handleLogOut}>
        Log out
      </Link>
    </>
  );
};

export default TimerApp;
