import { type FC } from 'react';
import { ProjectForm } from '@src/components/project-form';
import { useUpdateProjectMutation } from '@src/store/projects/api';
import type { Project } from '@src/types';

interface Props {
  project: Project;
  onSubmit?: () => void;
  onCancel?: () => void;
  isLock?: boolean;
}

export const UpdateProjectForm: FC<Props> = ({ project, onSubmit, onCancel, isLock }) => {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  return (
    <ProjectForm
      isLoading={isLoading}
      initialValues={project}
      submitText="Изменить"
      onSubmit={async e => {
        await updateProject({ id: project.id, data: e as Project });
        onSubmit?.();
      }}
      onCancel={onCancel}
      isLock={isLock}
    />
  );
};
