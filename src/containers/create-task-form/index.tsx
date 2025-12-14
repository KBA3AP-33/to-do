import { type FC } from 'react';
import { TaskForm } from '@src/components/task-form';
import { useCreateTaskMutation } from '@src/store/tasks/api';

interface Props {
  projectId?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const CreateTaskForm: FC<Props> = ({ projectId, onSubmit, onCancel }) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();

  return (
    <TaskForm
      isLoading={isLoading}
      onSubmit={async e => {
        await createTask({ projectId, ...e });
        onSubmit?.();
      }}
      onCancel={onCancel}
    />
  );
};
