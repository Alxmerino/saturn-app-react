import React, { useEffect } from 'react';
import { Link } from '@mui/material';
import { push } from 'redux-first-history';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout, selectLoggedIn } from '../../store/User/UserSlice';
import { Routes } from '../../config/constants';

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

  return (
    <>
      <h1>Timer App</h1>
      <Link variant="body2" onClick={handleLogOut}>
        Log out
      </Link>
    </>
  );
};

export default TimerApp;
