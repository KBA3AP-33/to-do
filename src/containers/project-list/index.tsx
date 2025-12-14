import { ProjectItem } from '@src/components/project-item';
import { type Project } from '@src/types';
import { ConfigProvider, Empty, List, Pagination } from 'antd';
import { type FC } from 'react';

interface Props {
  items?: Project[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onFavorite: (id: string) => void;
  page?: number;
  total?: number;
  onChangePage?: (page: number) => void;
}

export const ProjectList: FC<Props> = ({ items = [], onEdit, onDelete, onFavorite, page = 1, total, onChangePage }) => {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <ConfigProvider renderEmpty={() => <Empty description={'Нету проектов'} />}>
        <List
          itemLayout="horizontal"
          className={`flex-1 ${!items.length && 'flex justify-center items-center'}`}
          dataSource={items}
          renderItem={item => (
            <ProjectItem project={item} onEdit={onEdit} onDelete={onDelete} onFavorite={onFavorite} />
          )}
        />
        <Pagination align="end" current={+page} total={total} onChange={onChangePage} pageSize={10} />
      </ConfigProvider>
    </div>
  );
};
