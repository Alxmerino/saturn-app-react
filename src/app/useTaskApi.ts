import { Task } from '../types/timer';
import {
  useDeleteTaskMutation,
  useResetTaskMutation,
  useUpdateTaskMutation,
} from '../services/api';

const useTaskApi = () => {
  const [updateTask] = useUpdateTaskMutation();
  const [resetTask] = useResetTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // const [createTimer] = useCreateTimerMutation();
  // const [updateTimer] = useUpdateTimerMutation();
  // const [assignTimerProject] = useAssignProjectMutation();
  // const [jiraLogTime] = useJiraLogTimeMutation();

  /**
   * Update Task title or projectId attributes
   * @param id
   * @param title
   * @param projectId
   */
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

  /**
   * Reset Task's timer entries
   * @param id
   */
  const apiTaskReset = async ({ id }: Pick<Task, 'id'>) => {
    const { error } = await resetTask(id);

    return !error;
  };

  /**
   * Delete a Task
   * @param id
   */
  const apiTaskDelete = async ({ id }: Pick<Task, 'id'>) => {
    const { error } = await deleteTask(id);

    return !error;
  };

  return { apiTaskUpdate, apiTaskReset, apiTaskDelete };
};

export { useTaskApi };
