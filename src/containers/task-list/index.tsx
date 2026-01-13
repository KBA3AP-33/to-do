import { TaskItem } from '@src/components/task-item';
import { ConfigProvider, Empty, Flex, List, Pagination } from 'antd';
import { type Task } from '@src/types';
import { type FC } from 'react';

interface Props {
  items?: Task[];
  onShow: (id: string) => void;
  page?: number;
  total?: number;
  onChangePage?: (page: number) => void;
  hidePriority?: boolean;
}

export const TaskList: FC<Props> = ({ items = [], onShow, page = 1, total, onChangePage, hidePriority }) => {
  return (
    <Flex vertical gap={16} className="flex-1">
      <ConfigProvider renderEmpty={() => <Empty description="Нет задач" />}>
        <List
          itemLayout="horizontal"
          className={`flex-1 ${!items.length && 'flex justify-center items-center'}`}
          dataSource={items}
          renderItem={item => <TaskItem task={item} onShow={onShow} hidePriority={hidePriority} />}
        />
        <Pagination align="end" current={+page} total={total} onChange={onChangePage} pageSize={10} />
      </ConfigProvider>
    </Flex>
  );
};
