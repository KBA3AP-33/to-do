import { Loader } from '@src/components/loader';
import { ProtectedRoute } from '@src/components/protected-route';
import { TaskList } from '@src/containers/task-list';
import { MainLayout } from '@src/layouts/main';
import { ROUTES } from '@src/routes';
import { useGetTasksByStatusQuery } from '@src/store/tasks/api';
import { TaskStatus, type QueryParams } from '@src/types';
import { exclude } from '@src/utils/exclude';
import { plural } from '@src/utils/plural';
import { Divider, Typography } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const { Title } = Typography;

export const TasksPage = () => {
  const navigate = useNavigate();

  const { status = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isLoading } = useGetTasksByStatusQuery({ status, ...params });

  const { data: items = [], page, total = 0 } = data ?? {};

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

  return (
    <ProtectedRoute>
      <MainLayout>
        <Loader loading={isLoading}>
          <Title level={3}>
            {status.toLowerCase() === TaskStatus.IN_WORK.toLowerCase() ? 'В работе' : 'Выполнено'}
          </Title>
          <Title level={5}>{plural(total, { one: 'задача', few: 'задачи', many: 'задач' })}</Title>
          <Divider size="small" />

          <TaskList
            items={items}
            onShow={id => navigate(`${ROUTES.projects}/${id}`)}
            page={page}
            total={total}
            onChangePage={page => setParams({ page })}
          />
        </Loader>
      </MainLayout>
    </ProtectedRoute>
  );
};
