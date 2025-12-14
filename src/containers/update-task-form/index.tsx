import { type FC } from 'react';
import type { Task } from '@src/types';
import { TaskForm, type FieldType } from '@src/components/task-form';
import { useUpdateTaskMutation } from '@src/store/tasks/api';

interface Props {
  task: Task;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const UpdateTaskForm: FC<Props> = ({ task, onSubmit, onCancel }) => {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  return (
    <TaskForm
      isLoading={isLoading}
      initialValues={task as unknown as FieldType}
      submitText="Изменить"
      onSubmit={async e => {
        await updateTask({ id: task.id, data: e as Task });
        onSubmit?.();
      }}
      onCancel={onCancel}
    />
  );
};
