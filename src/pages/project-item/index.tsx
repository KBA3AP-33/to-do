import { PlusOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { MainLayout } from '@src/layouts/main';
import { Button, Divider, Modal, Typography } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFavoriteProjectMutation, useGetProjectQuery } from '@src/store/projects/api';
import { useGetTasksQuery, useLazyGetTaskQuery, useUpdateStatusTaskMutation } from '@src/store/tasks/api';
import { UpdateTaskForm } from '@src/containers/update-task-form';
import { DeleteTaskModal } from '@src/containers/delete-task-modal';
import { CreateTaskForm } from '@src/containers/create-task-form';
import { Loader } from '@src/components/loader';
import { ProtectedRoute } from '@src/components/protected-route';
import { ProjectItemList } from '@src/containers/project-item-list';

const { Title } = Typography;

export const ProjectItemPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const { id = '' } = useParams();
  const { data, isLoading } = useGetProjectQuery(id);
  const project = data?.data;

  const { data: tasks } = useGetTasksQuery(id);
  const [updateStatusTask] = useUpdateStatusTaskMutation();
  const [favoriteProject] = useFavoriteProjectMutation();

  const [trigger, { data: task, reset }] = useLazyGetTaskQuery();

  const onCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <Loader loading={isLoading}>
          <div className="flex justify-between items-center gap-2 mb-2">
            <Title level={3}>{project?.name}</Title>

            <div className="flex items-center gap-2">
              <Button
                type="default"
                onClick={async () => await favoriteProject(id)}
                icon={
                  project?.isFavourites ? (
                    <StarFilled style={{ color: '#ea4b3a' }} />
                  ) : (
                    <StarOutlined style={{ color: '#cacaca' }} />
                  )
                }
                style={{
                  fontSize: '16px',
                  borderColor: project?.isFavourites ? '#ea4b3a' : '',
                }}
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
            </div>
          </div>

          <ProjectItemList
            items={tasks?.data}
            onEdit={trigger}
            onDelete={setSelected}
            onUpdateStatus={updateStatusTask}
          />

          <DeleteTaskModal id={selected} onDelete={() => setSelected(null)} onCancel={() => setSelected(null)} />

          <Modal
            title={
              <>
                <Title level={4}>{task ? 'Изменить' : 'Добавить'} задачу</Title>
                <Divider size="small" />
              </>
            }
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
