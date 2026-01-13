import { ROUTES } from '@src/routes';
import { Divider, Typography } from 'antd';
import { plural } from '@src/utils/plural';
import { exclude } from '@src/utils/exclude';
import { MainLayout } from '@src/layouts/main';
import { Loader } from '@src/components/loader';
import { TaskList } from '@src/containers/task-list';
import { ProtectedRoute } from '@src/components/protected-route';
import { useGetTasksByStatusQuery } from '@src/store/tasks/api';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TaskStatus, type QueryParams } from '@src/types';

const { Title } = Typography;

export const TasksPage = () => {
  const navigate = useNavigate();

  const { status = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isLoading } = useGetTasksByStatusQuery({ status, ...params });
  const { data: items = [], page, total = 0 } = data ?? {};

  const setParams = (newParams: QueryParams) => {
    setSearchParams(exclude({ ...params, ...newParams }, { search: '', page: 1 }) as Record<string, string>);
  };

  const inWork = status.toLowerCase() === TaskStatus.IN_WORK.toLowerCase();

  return (
    <ProtectedRoute>
      <MainLayout>
        <Loader loading={isLoading}>
          <Title level={3}>{inWork ? 'В работе' : 'Выполнено'}</Title>
          <Title level={5}>{plural(total, { one: 'задача', few: 'задачи', many: 'задач' })}</Title>
          <Divider size="small" />

          <TaskList
            items={items}
            onShow={id => navigate(`${ROUTES.projects}/${id}`)}
            page={page}
            total={total}
            onChangePage={page => setParams({ page })}
            hidePriority={!inWork}
          />
        </Loader>
      </MainLayout>
    </ProtectedRoute>
  );
};
