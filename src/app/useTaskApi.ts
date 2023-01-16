import { useEffect } from 'react';

import { Task } from '../types/timer';
import { useUpdateTaskMutation } from '../services/api';

const useTaskApi = () => {
  const [updateTask] = useUpdateTaskMutation();
  const apiTaskUpdate = async ({
    id,
    title,
    projectId,
  }: Pick<Task, 'id' | 'title' | 'projectId'>): Promise<{
    title?: string;
    projectId?: number;
    errors?: Record<string, string[]> | unknown;
  }> => {
    const { data, error } = await updateTask({ title, projectId, id });
    const result = data?.data;
    const errorData = error?.data;

    return {
      title: result?.title,
      projectId: result?.projectId,
      errors: errorData?.errors,
    };
  };

  return { apiTaskUpdate };
};

export { useTaskApi };
