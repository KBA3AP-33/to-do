import { DebouncedSearch } from '@src/components/debounced-search';
import { Loader } from '@src/components/loader';
import { ProtectedRoute } from '@src/components/protected-route';
import { ProjectList } from '@src/containers/project-list';
import { MainLayout } from '@src/layouts/main';
import { useGetProjectsQuery } from '@src/store/projects/api';
import { type QueryParams } from '@src/types';
import { exclude } from '@src/utils/exclude';
import { plural } from '@src/utils/plural';
import { Divider, Flex, Typography } from 'antd';
import { useSearchParams } from 'react-router-dom';

const { Title } = Typography;

export const ProjectCompletedPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());

  const { data, isLoading } = useGetProjectsQuery(
    { ...params, isCompleted: true },
    { refetchOnMountOrArgChange: true }
  );
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

  const onSearch = (search: string) => {
    setParams({ search, page: 1 });
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <Loader loading={isLoading}>
          <Flex justify="space-between">
            <Title level={3}>Завершенные проекты ({total})</Title>

            <Flex justify="center" align="center">
              <DebouncedSearch placeholder="Поиск проектов" value={params.search} onSearch={onSearch} />
            </Flex>
          </Flex>

          <Divider size="small" />

          <ProjectList
            items={items}
            page={page}
            total={total}
            onChangePage={page => setParams({ page })}
            hideControls
          />
        </Loader>
      </MainLayout>
    </ProtectedRoute>
  );
};
