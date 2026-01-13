import { ProjectItem } from '@src/components/project-item';
import { type Project } from '@src/types';
import { ConfigProvider, Empty, Flex, List, Pagination } from 'antd';
import { type FC } from 'react';

interface Props {
  items?: Project[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFavorite?: (id: string) => void;
  onCompleted?: (id: string) => void;
  page?: number;
  total?: number;
  onChangePage?: (page: number) => void;
  hideControls?: boolean;
}

export const ProjectList: FC<Props> = ({
  items = [],
  onEdit,
  onDelete,
  onFavorite,
  onCompleted,
  page = 1,
  total,
  onChangePage,
  hideControls = false,
}) => {
  return (
    <Flex vertical gap={16} className="flex-1">
      <ConfigProvider renderEmpty={() => <Empty description="Нету проектов" />}>
        <List
          itemLayout="horizontal"
          className={`flex-1 ${!items.length && 'flex justify-center items-center'}`}
          dataSource={items}
          renderItem={item => (
            <ProjectItem
              project={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onFavorite={onFavorite}
              onCompleted={onCompleted}
              hideControls={hideControls}
            />
          )}
        />
        <Pagination align="end" current={+page} total={total} onChange={onChangePage} pageSize={10} />
      </ConfigProvider>
    </Flex>
  );
};
