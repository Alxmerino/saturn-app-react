import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Link, Grid, Box, Typography } from '@mui/material';
import { push } from 'redux-first-history';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Button, Copyright } from '../../components/common';
import { GenericLayout } from '../../components/layout';
import {
  selectLoggedIn,
  setCredentials,
  setLogin,
} from '../../store/User/UserSlice';
import { Routes } from '../../config/constants';
import { useLoginMutation } from '../../services/api';

const Login = (): JSX.Element => {
  const isLoggedIn: boolean = useAppSelector(selectLoggedIn);
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const formDate = new FormData(event.currentTarget);

    try {
      const { data: userData } = await login({
        email: formDate.get('email') as string,
        password: formDate.get('password') as string,
      });

      if (userData) {
        dispatch(setCredentials(userData));
        dispatch(setLogin());
      }
    } catch (err) {
      // @todo: handle error
      console.error('error', err);
    }
  };

  const handleSignUp = () => {
    dispatch(push('/signup'));
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(push(Routes.APP));
    }
  });

  return (
    <GenericLayout vAlign="center" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h2" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* <FormControlLabel */}
          {/*  control={<Checkbox value="remember" color="primary" />} */}
          {/*  label="Remember me" */}
          {/* /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            kind="primary"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2"> */}
              {/*  Forgot password? */}
              {/* </Link> */}
            </Grid>
            <Grid item>
              <Link variant="body2" onClick={handleSignUp}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </GenericLayout>
  );
};

export default Login;
