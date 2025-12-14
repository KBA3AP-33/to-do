import { type FC } from 'react';
import { ProjectForm } from '@src/components/project-form';
import { useCreateProjectMutation } from '@src/store/projects/api';

interface Props {
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const CreateProjectForm: FC<Props> = ({ onSubmit, onCancel }) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();

  return (
    <ProjectForm
      isLoading={isLoading}
      onSubmit={async e => {
        await createProject(e);
        onSubmit?.();
      }}
      onCancel={onCancel}
    />
  );
};
