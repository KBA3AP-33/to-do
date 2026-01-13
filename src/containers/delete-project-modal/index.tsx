import { DeleteModal } from '@src/components/delete-modal';
import { useDeleteProjectMutation } from '@src/store/projects/api';
import type { FC } from 'react';

interface Props {
  id: string | null;
  onDelete?: () => void;
  onCancel?: () => void;
}

export const DeleteProjectModal: FC<Props> = ({ id, onDelete, onCancel }) => {
  const [deleteProject, { isLoading }] = useDeleteProjectMutation();

  const handleDelete = async () => {
    if (!id) return;

    await deleteProject(id);
    onDelete?.();
  };

  return (
    <DeleteModal
      title="Удалить проект?"
      description="Проект будет удален безвозвратно."
      isLoading={isLoading}
      open={!!id}
      onOk={handleDelete}
      onCancel={onCancel}
    />
  );
};
