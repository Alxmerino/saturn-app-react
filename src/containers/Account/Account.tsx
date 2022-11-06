import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box, Typography, Avatar } from '@mui/material';
import { push } from 'redux-first-history';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectCurrentUser,
  selectLoggedIn,
  selectUserIntegration,
  setIntegration,
} from '../../store/User/UserSlice';
import { Routes } from '../../config/constants';

import {
  useJiraLoginMutation,
  useJiraLogoutMutation,
} from '../../services/api';
import { Button } from '../../components/common';
import { GenericLayout } from '../../components/layout';

const Account = (): JSX.Element => {
  const isLoggedIn: boolean = useAppSelector(selectLoggedIn);
  const integration = useAppSelector(selectUserIntegration);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [jiraLogin, { isLoading }] = useJiraLoginMutation();
  const [jiraLogout] = useJiraLogoutMutation();

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formDataObj: Record<string, FormDataEntryValue> = {};
    formData.forEach((value, key) => (formDataObj[key] = value));

    try {
      const { data: jiraUser, error } = await jiraLogin(formDataObj);

      if (error) {
        const errors: string[] = [];
        if (error?.data?.errors) {
          errors.push(error?.data?.message);
          Object.values(error?.data?.errors).forEach((error: any) =>
            errors.push(error[0])
          );
        } else if (error?.data?.data) {
          errors.push(error?.data?.data?.errorMessages[0]);
        }
        setErrors(errors);
      } else {
        setErrors([]);
        dispatch(
          setIntegration({
            integration: {
              name: 'JIRA',
              // @todo: Make this more generic
              metadata: {
                baseJiraUrl: formDataObj.baseJiraUrl,
                deviceName: formDataObj.deviceName,
              },
            },
            session: jiraUser?.data,
          })
        );
        dispatch(push(Routes.APP));
      }
    } catch (err) {
      // @todo: handle error
      console.error('error', err);
    }
  };

  const handleLogOut = async () => {
    try {
      const { data } = await jiraLogout({
        baseJiraUrl: integration.metadata.baseJiraUrl,
        deviceName: integration.metadata.deviceName,
      });

      if (data?.data.message === 'Success') {
        setErrors([]);
        dispatch(
          setIntegration({
            integration: { name: null, metadata: {} },
            session: null,
          })
        );
        // Todo: Delete JIRA session cookie
      } else {
        setErrors(['An error occurred']);
      }
    } catch (err) {
      // @todo: handle error
      console.error('error', err);
    }
  };

  const getUserInitials = () => {
    return user?.name
      .split(' ')
      .map((n: string) => n[0])
      .join('');
  };

  /**
   * Redirect home the user if not logged in
   */
  useEffect(() => {
    if (!isLoggedIn && !user) {
      dispatch(push(Routes.HOME));
    }
  }, []);

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
        <Typography component="h2" variant="h5" pb={2}>
          Hello, {user?.name}!
        </Typography>
        <Avatar
          src={user?.profilePhotoUrl}
          sx={{
            bgcolor: 'blue.500',
            height: 56,
            width: 56,
          }}
        >
          {getUserInitials()}
        </Avatar>

        {integration?.name ? (
          <Box mt={4} textAlign="center">
            <Typography>Connected with {integration?.name}</Typography>
            <Button
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              kind="primary"
              onClick={handleLogOut}
            >
              Log Out
            </Button>
          </Box>
        ) : (
          <Box
            pt={2}
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <input type="hidden" name="deviceName" value="SaturnWebApp" />
            <TextField
              error={errors.length > 0}
              margin="normal"
              required
              fullWidth
              id="baseJiraUrl"
              label="JIRA Domain"
              name="baseJiraUrl"
            />
            <TextField
              error={errors.length > 0}
              margin="normal"
              required
              fullWidth
              name="username"
              label="JIRA Username"
              type="username"
              id="username"
            />
            <TextField
              error={errors.length > 0}
              margin="normal"
              required
              fullWidth
              name="password"
              label="JIRA Password"
              type="password"
              id="password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              kind="primary"
            >
              {isLoading ? 'Loading' : 'Connect JIRA'}
            </Button>
          </Box>
        )}
        {errors.length > 0 &&
          errors.map((error) => (
            <Typography key={error} sx={{ color: '#d32f2f', fontSize: '14px' }}>
              {error}
            </Typography>
          ))}
      </Box>
    </GenericLayout>
  );
};

export default Account;
