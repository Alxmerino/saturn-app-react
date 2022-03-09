import React from 'react';
import { Stack } from '@mui/material';
import { push } from 'redux-first-history';

import { useAppDispatch } from '../../app/hooks';
import { Button, Text } from '../../components/common';
import { GenericLayout } from '../../components/layout';

const Home = () => {
  const dispatch = useAppDispatch();
  const handleLoginClick = () => {
    dispatch(push('/login'));
  };

  const handleSignupClick = () => {
    dispatch(push('/signup'));
  };

  return (
    <GenericLayout vAlign="center">
      <Text component="h1" variant="h3" align="center">
        Saturn Time Tracker
      </Text>
      <Stack direction="row" spacing={2} justifyContent="center" mt={3}>
        <Button onClick={handleLoginClick} type="primary">
          Login
        </Button>
        <Button onClick={handleSignupClick} type="primary">
          Signup
        </Button>
      </Stack>
    </GenericLayout>
  );
};

export default Home;
