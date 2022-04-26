import React, { useEffect, useState } from 'react';
import { Box, Link } from '@mui/material';
import { push } from 'redux-first-history';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectLoggedIn } from '../../store/User/UserSlice';
import { Routes } from '../../config/constants';
import { Text } from '../../components/common';
import { TimerHeader, TimerList } from '../../components/Timer';

const TimerApp = () => {
  const loggedIn = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();

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

  // @todo: remove Sample data
  function addDays(date: Date, days: number) {
    const copy = new Date(Number(date.getDate()));
    copy.setDate(date.getDate() + days);
    return copy;
  }
  const now: Date = new Date();
  const dates = ['Today', 'Yesterday', 'Mon, 25 Mar'];

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

      {/* @todo: Add active timer */}
      {/* @todo: Add timer list */}
      <Box pt={2}>
        {dates.map((date, i) => (
          <TimerList date={date} key={i} />
        ))}
      </Box>

      <Link variant="body2" onClick={handleLogOut}>
        Log out
      </Link>
    </>
  );
};

export default TimerApp;
