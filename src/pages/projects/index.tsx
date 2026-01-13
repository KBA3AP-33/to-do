import { PlusOutlined } from '@ant-design/icons';
import { DebouncedSearch } from '@src/components/debounced-search';
import { Loader } from '@src/components/loader';
import { ModalTitle } from '@src/components/modal-title';
import { ProtectedRoute } from '@src/components/protected-route';
import { CreateProjectForm } from '@src/containers/create-project-form';
import { DeleteProjectModal } from '@src/containers/delete-project-modal';
import { ProjectList } from '@src/containers/project-list';
import { UpdateProjectForm } from '@src/containers/update-project-form';
import { MainLayout } from '@src/layouts/main';
import {
  useCompleteAllTasksMutation,
  useFavoriteProjectMutation,
  useGetProjectsQuery,
  useLazyGetProjectQuery,
} from '@src/store/projects/api';
import { type QueryParams } from '@src/types';
import { exclude } from '@src/utils/exclude';
import { plural } from '@src/utils/plural';
import { Button, Divider, Flex, Modal, Typography } from 'antd';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNotifyEdit } from '@src/hooks/use-notify-edit';

const { Title } = Typography;

export const ProjectsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const [favoriteProject] = useFavoriteProjectMutation();
  const { data, isLoading } = useGetProjectsQuery(params, { refetchOnMountOrArgChange: true });

  const [completeAllTasks] = useCompleteAllTasksMutation();

  const { data: items = [], page, total = 0 } = data ?? {};

  const [trigger, { data: projectData, reset }] = useLazyGetProjectQuery();
  const project = projectData?.data;

  const setParams = (newParams: QueryParams) => {
    setSearchParams(
      exclude(
        { ...params, ...newParams },
        {
          search: '',
          page: 1,
        }
      ) as Record<string, string>
    );
  };

  const onSearch = (search: string) => {
    setParams({ search, page: 1 });
  };

  const isOpenModal = !!project || (!project && isModalOpen);
  const { editing, ref, notifyStart, notifyEnd } = useNotifyEdit('projects');

  const onCancel = () => {
    setIsModalOpen(false);
    ref.current = null;
    notifyEnd(project?.id ?? '');
    reset();
  };

  const onEdit = (id: string) => {
    trigger(id);
    ref.current = id;
    notifyStart(id);
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <Loader loading={isLoading}>
          <Title level={3}>Мои проекты</Title>

          <Flex justify="center" align="center" gap={8} className="!mb-2">
            <DebouncedSearch placeholder="Поиск проектов" value={params.search} onSearch={onSearch} />
            <Button
              icon={<PlusOutlined />}
              iconPlacement="start"
              variant="solid"
              color="primary"
              onClick={() => setIsModalOpen(true)}
            >
              Добавить проект
            </Button>
          </Flex>

          <Title level={5}>{plural(total, { one: 'проект', few: 'проекта', many: 'проектов' })}</Title>
          <Divider size="small" />

          <ProjectList
            items={items}
            onEdit={onEdit}
            onDelete={setSelected}
            onFavorite={favoriteProject}
            onCompleted={completeAllTasks}
            page={page}
            total={total}
            onChangePage={page => setParams({ page })}
          />

          <DeleteProjectModal id={selected} onDelete={() => setSelected(null)} onCancel={() => setSelected(null)} />

          <Modal
            title={<ModalTitle title={(project ? 'Изменить' : 'Добавить') + ' проект'} />}
            open={isOpenModal}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
          >
            {project ? (
              <UpdateProjectForm
                project={project}
                onSubmit={reset}
                onCancel={onCancel}
                isLock={(editing?.[project.id] ?? 0) > 0}
              />
            ) : (
              <CreateProjectForm onSubmit={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
            )}
          </Modal>
        </Loader>
      </MainLayout>
    </ProtectedRoute>
  );
};
