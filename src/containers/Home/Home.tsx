import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import { push } from 'redux-first-history';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Button, Text } from '../../components/common';
import { GenericLayout } from '../../components/layout';
import { selectLoggedIn } from '../../store/User/UserSlice';
import { Routes } from '../../config/constants';

const Home = () => {
  const isLoggedIn: boolean = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const handleLoginClick = () => {
    dispatch(push(Routes.LOGIN));
  };

  const handleSignupClick = () => {
    dispatch(push(Routes.SIGNUP));
  };

  /**
   * Redirect user to the main app if logged in
   */
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(push('/app'));
    }
  }, []);

  return !isLoggedIn ? (
    <GenericLayout vAlign="center">
      <Text component="h1" variant="h3" align="center">
        Saturn Time Tracker
      </Text>
      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        <Button onClick={handleLoginClick} kind="primary">
          Login
        </Button>
        <Button onClick={handleSignupClick} kind="primary">
          Signup
        </Button>
      </Stack>
    </GenericLayout>
  ) : null;
};

export default Home;
