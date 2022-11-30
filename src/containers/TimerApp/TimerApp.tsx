import React, { useEffect } from 'react';
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
import {
  addProjects,
  addTasks,
  selectProjects,
  selectTasksByDate,
} from '../../store/Timer/TimerSlice';
import {
  useGetProjectsQuery,
  useGetTasksQuery,
  useLogoutMutation,
} from '../../services/api';

const TimerApp = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoggedIn: boolean = useAppSelector(selectLoggedIn);
  const tasksByDate = useAppSelector(selectTasksByDate);
  const currentUser = useAppSelector(selectCurrentUser);
  const tasksByDateArray = Object.keys(tasksByDate);
  const [logout] = useLogoutMutation();
  const {
    data: apiProjects,
    isFetching: isFetchingProjects,
    isLoading: isLoadingProjects,
  } = useGetProjectsQuery();
  const {
    data: apiTasks,
    isFetching: isFetchingTasks,
    isLoading: isLoadingTasks,
  } = useGetTasksQuery();

  useEffect(() => {
    if (
      !isLoadingProjects &&
      !isFetchingProjects &&
      apiProjects &&
      apiProjects.length
    ) {
      dispatch(addProjects(apiProjects));
    }
  }, [apiProjects, isLoadingProjects, isFetchingProjects]);

  useEffect(() => {
    if (!isLoadingTasks && !isFetchingTasks && apiTasks && apiTasks.length) {
      dispatch(addTasks(apiTasks));
    }
  }, [apiTasks, isLoadingTasks, isFetchingTasks]);

  const handleLogOut = async () => {
    try {
      const results = await logout({
        email: currentUser.email,
      });

      // @todo: Fix type error
      if ('data' in results) {
        if (results.data.message === 'Success') {
          dispatch(setCredentials({ user: null, token: null }));
          dispatch(setLogout());
          dispatch(push(Routes.HOME));
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
        <Text component="h1" variant="h6" sx={{ color: '#3c4858' }}>
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
        {tasksByDateArray.length > 0 ? (
          tasksByDateArray.map((date: string) => (
            <TimerList
              user={currentUser}
              date={date}
              tasks={tasksByDate[date]}
              key={date}
            />
          ))
        ) : (
          <Paper elevation={3}>
            <Box px={2} py={3} textAlign="center">
              Work on something exciting!
            </Box>
          </Paper>
        )}
      </Box>
    </>
  );
};

export default TimerApp;
