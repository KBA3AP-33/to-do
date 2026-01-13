import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '@src/layouts/main';
import { Button, Divider, Flex, Modal, Typography } from 'antd';
import { CheckCircleOutlined, PlusOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { useCompleteAllTasksMutation, useFavoriteProjectMutation, useGetProjectQuery } from '@src/store/projects/api';
import {
  useCreateTaskMutation,
  useGetTasksQuery,
  useLazyGetTaskQuery,
  useUpdateStatusTaskMutation,
} from '@src/store/tasks/api';
import { Loader } from '@src/components/loader';
import { ModalTitle } from '@src/components/modal-title';
import { UpdateTaskForm } from '@src/containers/update-task-form';
import { DeleteTaskModal } from '@src/containers/delete-task-modal';
import { CreateTaskForm } from '@src/containers/create-task-form';
import { ProtectedRoute } from '@src/components/protected-route';
import { ProjectItemList } from '@src/containers/project-item-list';
import { ProjectStatus as ProjectStatusType } from '@src/config/statuses/project';
import { ProjectStatus } from '@src/components/project-status';
import type { Task } from '@src/types';
import { useThemeToken } from '@src/hooks/use-theme-token';

const { Title } = Typography;

export const ProjectItemPage = () => {
  const { token } = useThemeToken();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const { id = '' } = useParams();
  const { data, isLoading } = useGetProjectQuery(id);
  const project = data?.data;

  const { data: tasks } = useGetTasksQuery(id);
  const [updateStatusTask] = useUpdateStatusTaskMutation();
  const [favoriteProject, { isLoading: isLoadingFavorite }] = useFavoriteProjectMutation();

  const [completeAllTasks, { isLoading: isLoadingComplete }] = useCompleteAllTasksMutation();
  const [createTask] = useCreateTaskMutation();

  const [trigger, { data: task, reset }] = useLazyGetTaskQuery();

  const onCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const onDuplicate = async ({ name, description, date, priority, project, projectId }: Task) => {
    const { data } = await createTask({ name, description, date, priority, project, projectId });
    const { id } = data?.data ?? {};
    if (id) trigger(id);
  };

  const color = project?.isFavorite ? token?.colorCustomPrimary : '#cacaca';
  const favoriteIcon = project?.isFavorite ? <StarFilled style={{ color }} /> : <StarOutlined style={{ color }} />;

  return (
    <ProtectedRoute>
      <MainLayout>
        <Loader loading={isLoading}>
          <Flex justify="space-between" align="center" gap={8} className="!mb-2">
            <Title level={3}>{project?.name}</Title>

            <Flex align="center" gap={8}>
              {project?.isCompleted && (
                <ProjectStatus
                  className="!h-[32px] !flex !items-center !px-6 radius-[6px] !border-[#389e0d]"
                  status={ProjectStatusType.COMPLETED}
                  icon={<CheckCircleOutlined />}
                />
              )}

              <Button
                type="default"
                loading={isLoadingFavorite}
                icon={favoriteIcon}
                onClick={async () => await favoriteProject(id)}
                style={{ borderColor: color }}
                className="!text-base"
              />

              <Button
                icon={<PlusOutlined />}
                iconPlacement="start"
                variant="solid"
                color="primary"
                onClick={() => setIsModalOpen(true)}
              >
                Добавить задачу
              </Button>
              {!project?.isCompleted && !!project?.tasks?.length && (
                <Button
                  loading={isLoadingComplete}
                  icon={<CheckCircleOutlined />}
                  iconPlacement="start"
                  variant="solid"
                  color="primary"
                  onClick={async () => await completeAllTasks(`${project?.id}`)}
                >
                  Завершить
                </Button>
              )}
            </Flex>
          </Flex>
          <Divider size="small" />

          <ProjectItemList
            items={tasks?.data}
            onEdit={trigger}
            onDelete={setSelected}
            onUpdateStatus={updateStatusTask}
            onDuplicate={onDuplicate}
          />

          <DeleteTaskModal id={selected} onDelete={() => setSelected(null)} onCancel={() => setSelected(null)} />

          <Modal
            title={<ModalTitle title={(task ? 'Изменить' : 'Добавить') + ' задачу'} />}
            open={!!task || (!task && isModalOpen)}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
          >
            {task ? (
              <UpdateTaskForm task={task.data} onSubmit={reset} onCancel={onCancel} />
            ) : (
              <CreateTaskForm
                projectId={project?.id}
                onSubmit={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
              />
            )}
          </Modal>
        </Loader>
      </MainLayout>
    </ProtectedRoute>
  );
};
