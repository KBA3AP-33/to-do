import type { FC } from 'react';
import { DeleteModal } from '@src/components/delete-modal';
import { useDeleteTaskMutation } from '@src/store/tasks/api';

interface Props {
  id: string | null;
  onDelete?: () => void;
  onCancel?: () => void;
}

export const DeleteTaskModal: FC<Props> = ({ id, onDelete, onCancel }) => {
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();

  const handleDelete = async () => {
    if (!id) return;

    await deleteTask(id);
    onDelete?.();
  };

  return (
    <DeleteModal
      title="Удалить задачу?"
      description={`Задача будет удалена безвозвратно.`}
      isLoading={isLoading}
      open={!!id}
      onOk={handleDelete}
      onCancel={onCancel}
    />
  );
};
