import React, { useCallback, useEffect, useState } from 'react';

import {
  Alert,
  AlertProps,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
} from '@mui/material';
import {
  CloudDone,
  Delete,
  MoreVert,
  Pause,
  PlayArrow,
  RotateLeft,
  Update,
} from '@mui/icons-material';

import { ProjectMenu, Text } from '../../common';
import { Project, Task, User } from '../../../types/types';
import { formatDurationString } from '../../../services/utils';
import {
  resetTimer,
  stopTimer,
  removeTask,
  updateTask,
  addTimer,
  addProject,
  updateTimer,
} from '../../../store/Timer/TimerSlice';
import { useAppDispatch, useAppSelector, useTimer } from '../../../app/hooks';
import {
  useDeleteTaskMutation,
  useAssignProjectMutation,
  useJiraLogTimeMutation,
  useCreateProjectMutation,
  useUpdateTimerMutation,
  useCreateTimerMutation,
  useResetTaskMutation,
} from '../../../services/api';
import { selectUserIntegration } from '../../../store/User/UserSlice';
import { isNil } from 'lodash';

export interface TaskItemProps {
  projects: Project[];
  task: Task;
  onDurationUpdate?: (duration: number) => void;
  user: User;
}

const TimerTask = ({
  task,
  onDurationUpdate,
  user,
  projects,
}: TaskItemProps) => {
  const integration = useAppSelector(selectUserIntegration);
  const taskProject = projects.find((p) => p.id === task.projectId) ?? null;
  const dispatch = useAppDispatch();

  const [createProject] = useCreateProjectMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [resetTask] = useResetTaskMutation();
  const [createTimer] = useCreateTimerMutation();
  const [updateTimer] = useUpdateTimerMutation();
  const [assignTimerProject] = useAssignProjectMutation();
  const [jiraLogTime] = useJiraLogTimeMutation();

  const [project, setProject] = useState<Project | null>(taskProject);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity?: undefined | 'success' | 'info' | 'warning' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [timeLogged, setTimeLogged] = useState(false);
  const [projectMenuEl, setProjectMenuEl] = useState<null | HTMLElement>(null);
  const [fieldsEditable, setFieldsEditable] = useState<Record<string, boolean>>(
    {
      title: false,
      plannedTime: false,
      duration: false,
    }
  );
  const [timerAnchorEl, setTimerAnchorEl] = useState<null | HTMLElement>(null);
  const timerOpen = Boolean(timerAnchorEl);
  const [canLogTime, setCanLogTime] = useState<boolean>(
    !isNil(integration?.name) && !isNil(project?.title)
  );
  const {
    durationInSeconds,
    duration,
    activeTimer,
    running,
    taskDurationInSeconds,
  } = useTimer(task);

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTimerAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setTimerAnchorEl(null);
  };

  const handleTimerReset = async () => {
    if (confirm('Are you sure you want to reset this Task time entries?')) {
      if (task.synced) {
        try {
          await resetTask(task.id);
        } catch (err) {
          // @todo: Handle errors
          console.error('Reset Task Error', err);
        }
      }

      dispatch(resetTimer(task.id));
      handleMoreMenuClose();
    }
  };

  const handleTaskDelete = async () => {
    // @todo: Better way to confirm delete?
    if (confirm('Are you sure you want to delete this task?')) {
      if (task.synced) {
        try {
          await deleteTask(task.id);
        } catch (err) {
          // @todo: Handle errors
          console.error('Delete Task Error', err);
        }
      }

      dispatch(removeTask(task.id));
      handleMoreMenuClose();
    }
  };

  const handleTimerLog = async () => {
    try {
      // @todo: Check for integration
      // @todo: Should log from startTime or now?
      const { startTime } = task.timers[0];
      const started = (
        typeof startTime === 'string' ? startTime : startTime?.toISOString()
      )?.substr(0, 10);

      // Round up to the nearest 5m if over x2.5m
      const fiveMins = 300;
      const remainder = taskDurationInSeconds % fiveMins;
      const timeSpentSeconds =
        remainder >= fiveMins / 2
          ? taskDurationInSeconds + (fiveMins - remainder)
          : taskDurationInSeconds;

      const {
        data: { data },
        error,
      } = await jiraLogTime({
        comment: task.title,
        started,
        timeSpentSeconds,
        project: project,
        user: integration.metadata.username,
        baseJiraUrl: integration.metadata.baseJiraUrl,
        deviceName: integration.metadata.deviceName,
      });

      if (error) {
        let errorMessage = 'Something went wrong!';

        if (error.status === 401) {
          errorMessage = 'JIRA Session expired, please log in again!';
        } else {
          let tempErrorMessages: string[] = [];

          if (error?.data?.errorMessages.length) {
            tempErrorMessages = tempErrorMessages.concat(
              error?.data?.errorMessages
            );
          } else if (Array.isArray(error?.data?.errors)) {
            tempErrorMessages = tempErrorMessages.concat(error?.data?.errors);
          } else if (typeof error?.data?.errors === 'object') {
            tempErrorMessages = tempErrorMessages.concat(
              Object.values(error?.data?.errors)
            );
          }

          errorMessage = tempErrorMessages.join('');
        }

        setToast({
          open: true,
          message: errorMessage,
          severity: 'error',
        });
      }

      if (data?.length) {
        setCanLogTime(false);
        setTimeLogged(true);
        handleMoreMenuClose();
      }
    } catch (err) {
      // @todo: Handle errors
      console.error('JIRA Log Error', err);
    }
  };

  const handleTimerStart = async () => {
    try {
      if (task.synced) {
        const now = new Date();
        const { data: timerResult } = await createTimer({
          title: task.title,
          userId: user.id,
          taskId: task.id,
          projectId: task.projectId,
          running: true,
          billable: false,
          duration: '',
          durationInSeconds: 0,
          startTime: now.toISOString().slice(0, 19).replace('T', ' '),
          endTime: now.toISOString().slice(0, 19).replace('T', ' '),
        });

        dispatch(addTimer({ taskId: task.id, timer: { ...timerResult } }));
      } else {
        dispatch(addTimer({ taskId: task.id }));
      }
    } catch (err) {
      console.error('Error starting timer', err);
    }
  };

  const handleTimerStop = async () => {
    try {
      if (activeTimer?.id) {
        const now = new Date();

        if (task.synced) {
          await updateTimer({
            id: activeTimer.id,
            durationInSeconds,
            duration,
            running: false,
            endTime: now.toISOString().slice(0, 19).replace('T', ' '),
          });
        }

        dispatch(
          stopTimer({
            taskId: task.id,
            timerId: activeTimer?.id,
            durationInSeconds,
            duration,
            endTime: now,
          })
        );
      }
    } catch (err) {
      // @todo: Handle error
      console.error('Error stopping timer', err);
    }
  };

  const handleEditableField = (field: string) => {
    setFieldsEditable({
      title: false,
      plannedTime: false,
      duration: false,
      [field]: !fieldsEditable[field],
    });
  };

  const handleEditableFieldPress = (
    e: any, // Used any, so we can use e.target.value
    field: string
  ) => {
    if (e.key === 'Escape') {
      handleEditableField(field);
      return;
    }

    if (e.key === 'Enter') {
      handleEditableField(field);
      const newTaskProps: Task = {
        ...task,
      };

      switch (field) {
        case 'title':
          newTaskProps.title = e.target.value;
          break;
      }

      // @todo: Only update if the value has changed
      dispatch(updateTask(newTaskProps));
    }
  };

  const handleProjectMenuClose = async ({
    title,
    colorCode,
    projectId,
  }: {
    title: string;
    colorCode: number;
    projectId: number | string;
  }) => {
    try {
      const project = projects.find(
        (p: Project) =>
          p.id === projectId || p.title.toLowerCase() === title.toLowerCase()
      );

      if (project) {
        // @TODO: catch error from API call and update task accordingly
        const { data: taskResult }: { data: Project } =
          await assignTimerProject({
            id: task.id,
            projectId: project.id,
          });
        dispatch(updateTask({ ...task, ...taskResult }));
        setProject(project);
      } else if (title !== '') {
        const project = {
          id: Date.now(),
          title,
          colorCode,
          userId: user.id,
        };
        // @TODO: catch error from API call and update task accordingly
        const { data: projectResult }: { data: Project } = await createProject(
          project
        );

        dispatch(addProject({ ...project, ...projectResult }));
        dispatch(
          updateTask({
            id: task.id,
            projectId: projectResult?.id ?? project.id,
          })
        );
        setProject({ ...project, ...projectResult });
      }
    } catch (err) {
      console.error('Could not assign project', err);
    }

    setProjectMenuEl(null);
  };

  const RenderDuration = useCallback(() => {
    const duration = running
      ? taskDurationInSeconds + durationInSeconds
      : taskDurationInSeconds;

    return (
      <Text
        // color="grey.800"
        component="span"
        onClick={() => handleEditableField('duration')}
        sx={{ cursor: 'pointer', color: '#7a778a' }}
      >
        {formatDurationString(duration)}
      </Text>
    );
  }, [running, taskDurationInSeconds, durationInSeconds]);

  useEffect(() => {
    if (running && typeof onDurationUpdate !== 'undefined') {
      onDurationUpdate(durationInSeconds);
    }
  }, [durationInSeconds, running]);

  return (
    <>
      <Box
        sx={{
          py: 1,
          pr: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: running ? 'blue.50' : '',
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'grey.300',
          position: 'relative',
        }}
      >
        <IconButton
          // color="primary"
          size="small"
          sx={{ mr: 1, color: '#3c4858' }}
          onClick={handleMoreMenuOpen}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="more-menu"
          anchorEl={timerAnchorEl}
          open={timerOpen}
          onClose={handleMoreMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {canLogTime && (
            <div>
              <MenuItem onClick={handleTimerLog}>
                <ListItemIcon>
                  <Update fontSize="small" />
                </ListItemIcon>
                <ListItemText>Log Time</ListItemText>
              </MenuItem>
              <Divider />
            </div>
          )}
          <MenuItem onClick={handleTimerReset}>
            <ListItemIcon>
              <RotateLeft fontSize="small" />
            </ListItemIcon>
            <ListItemText>Reset</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleTaskDelete}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
        <Box
          sx={{
            flex: 1,
            pr: 2,
          }}
        >
          {fieldsEditable.title ? (
            <TextField
              fullWidth
              hiddenLabel
              autoFocus
              id="timer-title"
              size="small"
              variant="standard"
              defaultValue={task.title}
              onKeyPress={(e) => handleEditableFieldPress(e, 'title')}
              onBlur={() => handleEditableField('title')}
            />
          ) : (
            <Text
              onClick={() => handleEditableField('title')}
              sx={{ cursor: 'pointer', color: '#3c4858' }}
            >
              {task.title}
            </Text>
          )}
          <ProjectMenu
            color="action"
            project={project}
            projectMenuEl={projectMenuEl}
            onOpen={(el: HTMLElement) => setProjectMenuEl(el)}
            onClose={handleProjectMenuClose}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto',
          }}
        >
          <>
            <RenderDuration />
            {/* <RenderPlannedTime /> */}
          </>

          <IconButton
            color="primary"
            size="small"
            sx={{ ml: 1 }}
            onClick={running ? handleTimerStop : handleTimerStart}
          >
            {running ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Box>
        {timeLogged && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 4,
            }}
          >
            <CloudDone width="16px" color="success" />
          </Box>
        )}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((state) => ({ open: false, message: '' }))}
      >
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </>
  );
};

export default TimerTask;
