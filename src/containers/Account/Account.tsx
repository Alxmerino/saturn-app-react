import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Box, Typography, Avatar, Divider } from '@mui/material';
import { push } from 'redux-first-history';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  setLogout,
  selectCurrentUser,
  selectLoggedIn,
  selectUserIntegration,
  selectUserSession,
  setIntegration,
  setSession,
  setCredentials,
} from '../../store/User/UserSlice';
import { Routes } from '../../config/constants';

import {
  useGetIntegrationsQuery,
  useLogoutMutation,
  useJiraLogoutMutation,
} from '../../services/api';
import { Button } from '../../components/common';
import { GenericLayout } from '../../components/layout';
import { JiraServerIcon } from '../../assets/icons';
import JIRALogin from '../../components/integrations/jira/Login';
import { selectIsLocal, setLocal } from '../../store/Timer/TimerSlice';

const Account = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoggedIn: boolean = useAppSelector(selectLoggedIn);
  const integration = useAppSelector(selectUserIntegration);
  const session = useAppSelector(selectUserSession);
  const user = useAppSelector(selectCurrentUser);
  const isLocal = useAppSelector(selectIsLocal);

  const [logout] = useLogoutMutation();
  const [jiraLogout] = useJiraLogoutMutation();
  const {
    data: apiIntegrations,
    isFetching: isFetchingIntegrations,
    isLoading: isLoadingIntegrations,
  } = useGetIntegrationsQuery('', {
    skip: isLocal,
  });

  const [jiraOpen, setJiraOpen] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const dispatchLogout = () => {
    dispatch(setCredentials({ user: null, token: null }));
    dispatch(setLogout());
    dispatch(setSession(null));
    dispatch(setLocal(false));
    dispatch(push(Routes.HOME));
  };

  const handleLogOut = async () => {
    if (isLocal) {
      return dispatchLogout();
    }

    try {
      const results = await logout({
        email: user.email,
      });

      // @todo: Fix type error
      if ('data' in results) {
        if (results.data.message === 'Success') {
          dispatchLogout();
        }
      }
    } catch (err) {
      // @todo: handle error
      console.log('ERROR', err);
    }
  };

  const handleJiraLogOut = async () => {
    try {
      const { data } = await jiraLogout({
        baseJiraUrl: integration.metadata.baseJiraUrl,
        deviceName: integration.metadata.deviceName,
      });

      if (data?.data.message === 'Success') {
        setErrors([]);
      }

      // Clear user session
      dispatch(setSession(null));
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

  // Fetch user integrations
  useEffect(() => {
    if (
      !isFetchingIntegrations &&
      !isLoadingIntegrations &&
      apiIntegrations &&
      apiIntegrations.length
    ) {
      // @todo: Update type with integration
      apiIntegrations.forEach((int: any) => {
        dispatch(
          setIntegration({
            integration: {
              id: int.id,
              name: int.name,
              metadata: JSON.parse(int.metadata),
            },
          })
        );
      });
    }
  }, [isFetchingIntegrations, isLoadingIntegrations, apiIntegrations]);

  return (
    <GenericLayout maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 400,
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

        {!isLocal && (
          <>
            <Typography component="h3" variant="h6" mt={4}>
              Time Tracking Integrations
            </Typography>
            <Divider sx={{ width: '100%' }} />

            {/* Connect a new integration */}
            {!integration?.name && (
              <Box pt={2}>
                <Button
                  kind="text"
                  onClick={() => {
                    setJiraOpen(true);
                  }}
                >
                  <>
                    <JiraServerIcon width={24} height={24} />
                    <Typography ml={1}>
                      Track time on tasks and tickets in JIRA.
                    </Typography>
                  </>
                </Button>
              </Box>
            )}

            {/* Integration connected and with a session */}
            {integration?.name && session && (
              <Box mt={4} textAlign="center">
                {/* @todo: Map out human readable names */}
                <Typography sx={{ mb: 2 }}>
                  Connected with {integration?.name}
                </Typography>
                <Button variant="contained" kind="outline" disabled>
                  Disconnect JIRA
                </Button>
                <Button
                  variant="contained"
                  sx={{ ml: 2 }}
                  kind="primary"
                  onClick={handleJiraLogOut}
                >
                  JIRA Log out
                </Button>
              </Box>
            )}

            {/* Session Expired */}
            {integration?.name && !session && (
              <Button
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                kind="primary"
                onClick={() => setJiraOpen(true)}
              >
                JIRA Re-log in
              </Button>
            )}

            <JIRALogin open={jiraOpen} onClose={() => setJiraOpen(false)} />

            {errors.length > 0 &&
              errors.map((error) => (
                <Typography
                  key={error}
                  sx={{ color: '#d32f2f', fontSize: '14px' }}
                >
                  {error}
                </Typography>
              ))}
          </>
        )}
      </Box>

      <Box mt={4} textAlign="center">
        <Divider />
        <Button
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          kind="primary"
          onClick={handleLogOut}
        >
          Log Out
        </Button>
      </Box>
    </GenericLayout>
  );
};

export default Account;
