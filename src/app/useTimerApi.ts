import {
  useCreateTimerMutation,
  useUpdateTimerMutation,
} from '../services/api';

const useTimerApi = () => {
  const [createTimer] = useCreateTimerMutation();
  const [updateTimer] = useUpdateTimerMutation();
};

export { useTimerApi };
