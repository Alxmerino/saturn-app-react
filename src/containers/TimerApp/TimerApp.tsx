import React, { useEffect, useState } from 'react';
import { Avatar, Box, Link, Paper } from '@mui/material';
import { push } from 'redux-first-history';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  setLogout,
  selectLoggedIn,
  setCredentials,
  selectCurrentUser,
} from '../../store/User/UserSlice';
import { Routes } from '../../config/constants';
import { Text } from '../../components/common';
import { TimerHeader, TimerList } from '../../components/Timer';
import { selectTimersByDate } from '../../store/Timer/TimerSlice';
import { useLogoutMutation } from '../../services/api';

const TimerApp = (): JSX.Element => {
  const isLoggedIn: boolean = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const timersByDate = useAppSelector(selectTimersByDate);
  const currentUser = useAppSelector(selectCurrentUser);
  const timersByDateArray = Object.keys(timersByDate);
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogOut = async () => {
    try {
      const results = await logout({
        email: currentUser.email,
      });

      // @todo: Fix type error
      if ('data' in results) {
        if (results.data.message === 'Success') {
          console.log('LOGOUT', results);
          dispatch(setCredentials({ user: null, token: null }));
          dispatch(setLogout());
        }
      }
    } catch (err) {
      // @todo: handle error
      console.log('ERROR', err);
    }
  };

  const handleOnAvatarClick = () => {
    dispatch(push(Routes.ACCOUNT));
  };

  const getUserInitials = () => {
    return currentUser?.name
      .split(' ')
      .map((n: string) => n[0])
      .join('');
  };

  /**
   * Redirect home the user if not logged in
   */
  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(push(Routes.HOME));
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          pt: 1,
          pb: 2,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text component="h1" variant="h6">
          Saturn Time Tracker
        </Text>
        <Link sx={{ cursor: 'pointer' }} onClick={handleOnAvatarClick}>
          <Avatar
            src={currentUser?.profilePhotoUrl}
            sx={{
              bgcolor: 'blue.500',
              height: 24,
              width: 24,
              fontSize: '0.75rem',
            }}
          >
            {getUserInitials()}
          </Avatar>
        </Link>
        <Box width="100%">
          <TimerHeader />
        </Box>
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
        {isLoading ? 'Logging Out...' : 'Log out'}
      </Link>
    </>
  );
};

export default TimerApp;
