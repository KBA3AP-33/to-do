import { TaskItem } from '@src/components/task-item';
import { ConfigProvider, Empty, List, Pagination } from 'antd';
import { type Task } from '@src/types';
import { type FC } from 'react';

interface Props {
  items?: Task[];
  onShow: (id: string) => void;
  page?: number;
  total?: number;
  onChangePage?: (page: number) => void;
}

export const TaskList: FC<Props> = ({ items = [], onShow, page = 1, total, onChangePage }) => {
  return (
    <div className="flex flex-col gap-4 flex-1">
      <ConfigProvider renderEmpty={() => <Empty description={'Нет задач'} />}>
        <List
          itemLayout="horizontal"
          className={`flex-1 ${!items.length && 'flex justify-center items-center'}`}
          dataSource={items}
          renderItem={item => <TaskItem task={item} onShow={onShow} />}
        />
        <Pagination align="end" current={+page} total={total} onChange={onChangePage} pageSize={10} />
      </ConfigProvider>
    </div>
  );
};
