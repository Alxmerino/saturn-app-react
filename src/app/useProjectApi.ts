import { useCreateProjectMutation } from '../services/api';
import { Project } from '../types/timer';

const useProjectApi = () => {
  const [createProject] = useCreateProjectMutation();

  const apiProjectCreate = async (args: Project) => {
    const { data, error } = await createProject(args);
    const project = data?.data;
    const errorData = error?.data;

    return {
      project,
      errors: errorData?.errors,
    };
  };
};

export { useProjectApi };
