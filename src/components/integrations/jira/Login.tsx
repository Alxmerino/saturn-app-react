import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

import { Button } from '../../common';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  selectUserIntegration,
  setIntegration,
  setSession,
} from '../../../store/User/UserSlice';
import {
  useCreateIntegrationMutation,
  useJiraLoginMutation,
} from '../../../services/api';
import { push } from 'redux-first-history';
import { Routes } from '../../../config/constants';

interface JIRALoginProps {
  open: boolean;
  onClose?: (value?: unknown) => void;
}

const JIRALogin = ({ open, onClose }: JIRALoginProps) => {
  const dispatch = useAppDispatch();
  const integration = useAppSelector(selectUserIntegration);
  const [jiraLogin, { isLoading }] = useJiraLoginMutation();
  const [createIntegration] = useCreateIntegrationMutation();

  const [formData, setFormData] = useState({
    deviceName: 'SaturnWebApp',
    username: '',
    password: '',
    baseJiraUrl: integration?.metadata?.baseJiraUrl ?? '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const canSubmit = useMemo(() => {
    return Object.values(formData).filter(Boolean).length === 4;
  }, [formData]);

  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    event.preventDefault();

    if (!integration?.name) {
      try {
        const { data: _apiIntegration, error } = await createIntegration({
          name: 'JIRA_SERVER',
          metadata: JSON.stringify({
            deviceName: formData.deviceName,
            baseJiraUrl: formData.baseJiraUrl,
          }),
        });

        // @todo: Handle API error
        if (!error) {
          dispatch(
            setIntegration({
              integration: {
                name: 'JIRA_SERVER',
                // @todo: Make this more generic?
                metadata: {
                  username: formData.username,
                  baseJiraUrl: formData.baseJiraUrl,
                  deviceName: formData.deviceName,
                },
              },
            })
          );
        }
      } catch (err) {
        console.error('Create Integration Error:', err);
      }
    }

    try {
      const { data: jiraUser, error } = await jiraLogin(formData);

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
        dispatch(setSession(jiraUser?.data));

        handleOnClose();
      }
    } catch (err) {
      // @todo: handle error
      setErrors(['An error occurred']);
      console.error('error', err);
    }
  };

  const handleOnChange = (key: string, value: string) => {
    setFormData((state) => ({
      ...state,
      [key]: value,
    }));
  };

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleOnClose}>
      <DialogTitle>Connect to JIRA</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            error={errors.length > 0}
            margin="normal"
            required
            fullWidth
            onChange={(e) => handleOnChange('baseJiraUrl', e.target.value)}
            id="baseJiraUrl"
            label="JIRA Domain"
            name="baseJiraUrl"
            defaultValue={integration?.metadata?.baseJiraUrl}
          />
          <TextField
            error={errors.length > 0}
            margin="normal"
            required
            fullWidth
            onChange={(e) => handleOnChange('username', e.target.value)}
            name="username"
            label="JIRA Username"
            id="username"
          />
          <TextField
            error={errors.length > 0}
            margin="normal"
            required
            fullWidth
            onChange={(e) => handleOnChange('password', e.target.value)}
            name="password"
            label="JIRA Password"
            type="password"
            id="password"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ mr: 2, mb: 2 }}>
        <Button kind="outlined" onClick={handleOnClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || !canSubmit}
          kind="primary"
        >
          {isLoading
            ? 'Loading'
            : integration?.name
            ? 'Reconnect JIRA'
            : 'Connect JIRA'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JIRALogin;
